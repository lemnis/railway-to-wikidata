import { parse } from "csv-parse/sync";
import { distanceTo } from "geolocation-utils";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import ProgressBar from "progress";
import { TrainlineStation } from "./trainline.types";
import fetch from "node-fetch";
import { findCountryByAlpha2 } from "../../transform/country";

export const getStations = async (): Promise<TrainlineStation[]> => {
  const rawCsv = await fetch(
    "https://raw.githubusercontent.com/trainline-eu/stations/master/stations.csv"
  ).then((response) => response.text());
  return parse(rawCsv, {
    delimiter: ";",
    columns: true,
  }).map((d: any) => {
    let latitude: number, longitude: number;
    for (const key in d) {
      if (Object.prototype.hasOwnProperty.call(d, key)) {
        if (key.endsWith("_is_enabled") && d[key] === "f") {
          delete d[key];
          continue;
        } else if (d[key] && key === "longitude") {
          longitude = parseFloat(d[key]);
        } else if (d[key] && key === "latitude") {
          latitude = parseFloat(d[key]);
        }
        switch (d[key]) {
          case "":
            delete d[key];
            break;
          case "f":
            d[key] = false;
            break;
          case "t":
            d[key] = true;
            break;
        }
      }
    }
    if (latitude! || longitude!) d["coordinates"] = [latitude!, longitude!];
    return d;
  });
};

export const grouped = async () => {
  const stations = await getStations();
  const bar = new ProgressBar(
    "Combine aliases [:bar] :current/:total :percent :elapseds",
    { total: stations.length }
  );
  const aliased =
    // Match id
    stations.reduce((map, station) => {
      bar.tick();
      const id = station.same_as || station.id;

      let aliasList: TrainlineStation[] | undefined = [];
      if (station.same_as) {
        // get alias
        aliasList = map.get(station.same_as);
        if (!aliasList) {
          const alias = stations.find(({ id: currentId }) => currentId === id);
          if (alias) aliasList = [alias];
          if (alias?.same_as) {
            console.log(
              "Found a alias who as another alias",
              "from:",
              station.id,
              "alias:",
              alias?.same_as
            );
          }
        }

        if (!aliasList || aliasList.length === 0) {
          console.log("Found empty alias list, from:", station.id);
        }
      }

      map.set(id, [...(map.get(id) || []), station]);

      if (station.same_as && map.has(station.id)) {
        console.log("Found alias who has own instance, id:", station.id);
      }

      return map;
    }, new Map<string, TrainlineStation[]>());

  // const progressBar = new ProgressBar(
  //   "Removing name aliases [:bar] :current/:total :percent :elapseds",
  //   { total: aliased.size }
  // );

  // const iterator = aliased.entries();
  // const skip: string[] = [];
  // let next = iterator.next();
  // while (!next.done) {
  //   progressBar.tick();
  //   const [key, aliasList] = next.value;

  //   if (
  //     aliasList.some((i) => skip.includes(i.id)) &&
  //     !aliasList.every((i) => skip.includes(i.id))
  //   ) {
  //     console.log(
  //       ":(",
  //       aliasList.map((i) => i.id),
  //       skip
  //     );
  //   } else if (aliasList.every((i) => skip.includes(i.id))) {
  //     aliased.delete(key);
  //   }

  //   // Find stations tha has the same name, and if they should be aliases
  //   const nameMatch = stations.filter((a) =>
  //     aliasList.every(
  //       (b) =>
  //         a !== b &&
  //         a.id !== b.id &&
  //         a.name === b.name &&
  //         a.is_city === b.is_city &&
  //         a.is_airport === b.is_airport &&
  //         a.name === b.name &&
  //         a.same_as !== b.id &&
  //         a.parent_station_id !== b.id &&
  //         b.parent_station_id !== a.id
  //     )
  //   );
  //   if (nameMatch.length > 0) {
  //     const distance = nameMatch
  //       .map((n) => {
  //         const closest = aliasList
  //           .map(
  //             (station) =>
  //               n.longitude &&
  //               n.latitude &&
  //               station.longitude &&
  //               station.latitude &&
  //               distanceTo(n, station)
  //           )
  //           .filter(Boolean)
  //           .sort()?.[0];

  //         return [closest, n] as [number, TrainlineStation];
  //       })
  //       .filter((i) => i[0] !== undefined);

  //     if (distance.length > 0) {
  //       if (distance.some((i) => i[0] < 3000)) {
  //         distance.forEach(([, item]) => {
  //           skip.push(item.id);
  //           aliasList.push(item);
  //         });
  //       } else {
  //         progressBar.interrupt(
  //           [
  //             "Could be city with the same name or a alias? ",
  //             aliasList.map((i) => [i.name, i.id]),
  //             nameMatch.map((i) => i.id),
  //             distance[0][0]
  //           ].toString()
  //         );
  //       }
  //     } else {
  //       progressBar.interrupt(
  //         [
  //           "Could be city with the same name or a alias? ",
  //           aliasList.map((i) => [i.name, i.id]),
  //           nameMatch.map((i) => i.id),
  //         ].toString()
  //       );
  //     }
  //   }

  //   next = iterator.next();
  // }

  const mapped = Array.from(aliased.values());

  // Merge array of stations, to single object with array of values.
  // e.g. from [{ foo: 1 }, { foo: 2}] to [{ foo: [1, 2] }]
  const simplified = mapped.map((stations) =>
    stations.reduce<{
      [key in keyof TrainlineStation]: TrainlineStation[key][];
    }>((result, station) => {
      let key: keyof TrainlineStation;

      for (key in station) {
        if (Object.prototype.hasOwnProperty.call(station, key)) {
          const value = station[key];
          if (value === undefined) continue;
          result[key] = (result[key] as any) || [];
          if (!result[key]!.includes(value as never)) {
            result[key]!.push(value as never);
          }
        }
      }
      return result;
    }, {} as any)
  );

  const groupProgressBar = new ProgressBar(
    "Group by cities, bus stops & train stations [:bar] :current/:total :percent :elapseds",
    { total: simplified.length }
  );

  // Group by cities, bus stops & train stations
  // (Cities are only classified if they have multiple children)
  return simplified.reduce(
    (places, station, index, stationList) => {
      groupProgressBar.tick();
      if (station.is_city?.every(Boolean)) {
        const children = stationList.filter((child) =>
          child.parent_station_id?.some((id) => id && station.id.includes(id))
        );
        const hasMainStation = children.some((child) => child.is_main_station);

        if (children.length > 0 && hasMainStation) {
          if (!places.cities.includes(station)) places.cities.push(station);
          return places;
        }
      }

      const trainIds = getTrainIds(station);
      const busIds = getBusIds(station);

      if (trainIds.size < 2 && busIds.size > 0) {
        if (!places.busStops.includes(station)) places.busStops.push(station);
      } else if (trainIds.size === 0 && busIds.size === 0) {
        // is empty ignore
      } else if (trainIds.size >= 2) {
        if (!places.trainStations.includes(station))
          places.trainStations.push(station);
      }

      return places;
    },
    {
      cities: [] as {
        [key in keyof TrainlineStation]: TrainlineStation[key][];
      }[],
      busStops: [] as {
        [key in keyof TrainlineStation]: TrainlineStation[key][];
      }[],
      trainStations: [] as {
        [key in keyof TrainlineStation]: TrainlineStation[key][];
      }[],
    }
  );
};

export const map = (station: {
  [key in keyof TrainlineStation]: any[];
}): LocationV4 => {
  const stationCode = station.country.map((country) =>
    getStationCodeByCountry(country, station)
  );

  const labels: LocationV4["labels"] = Object.entries(station)
    .filter(([key]) => key.startsWith("info:"))
    .map(([key, values]) =>
      values.map((value: string) => ({
        value: value.split("(")[0].trim(),
        lang: key.slice(key.indexOf(":") + 1),
        variants: [],
      }))
    )
    .flat();
  if (station.name) {
    station.name.map((name) =>
      labels.push({ value: name?.split("(")[0].trim() })
    );
  }
  const variants: [RegExp, string][] = [
    [/ Hbf( |$)/g, "Hauptbahnhof"],
    [/ Bf( |$)/g, "Bahnhof"],
    [/( |^)[A-Z]{2,4}( |$)/g, ""],
    [/( |^)St-/g, "Saint-"],
    [/( |^)St-/g, "St."],
    [/( |^)St./g, "Station"],
    [/( |^)St /g, "Saint "],
    [/( |^)Ste-/g, "Sainte-"],
  ];
  labels.forEach((label) => {
    variants.forEach(([regex, replace]) => {
      if (label.value.match(regex))
        label.variants?.push(label.value.replace(regex, replace));
    });
  });

  const url = `https://trainline-eu.github.io/stations-studio/#/station/${station.id?.[0]}`;

  return {
    id: url,
    labels,
    claims: {
      // [Property.StationCode]: stationCode.flat().map((value) => ({ value })),
      [CodeIssuer.UIC]: station.uic?.map((value) => ({
        value,
        references: {
          [Property.ReferenceURL]: url,
        },
      })),
      [Property.CoordinateLocation]: station.coordinates?.map((value) => ({
        value,
      })),
      [Property.Country]: station.country
        .map((c) => findCountryByAlpha2(c)?.wikidata)
        ?.map((value) => ({ value })),
      [CodeIssuer.Benerail]: station.benerail_id?.map((value) => ({
        value,
        references: {
          [Property.ReferenceURL]: url,
        },
      })),
      [CodeIssuer.ATOC]: station.atoc_id?.map((value) => ({
        value,
        references: {
          [Property.ReferenceURL]: url,
        },
      })),
      [CodeIssuer.SNCF]: station.sncf_id?.map((value) => ({
        value,
        references: {
          [Property.ReferenceURL]: url,
        },
      })),
      [CodeIssuer.Trainline]: station.id?.map((value) => ({
        value,
        references: {
          [Property.ReferenceURL]: url,
        },
      })),
      [Property.LocatedInTimeZone]: station.time_zone?.map((value) => ({
        value,
      })),
      [CodeIssuer.IATA]: station.iata_airport_code?.map((value) => ({ value })),
      [CodeIssuer.IBNR]: Array.from(
        new Set(
          [station.cff_id, station.db_id, station.obb_id].flat().filter(Boolean)
        )
      )?.map((value) => ({
        value,
        references: {
          [Property.ReferenceURL]: url,
        },
      })),
    },
  };
};

export const getLocations = async (
  stationId?: Omit<
    keyof TrainlineStation,
    "latitude" | "longitude" | "uic" | "country"
  >
): Promise<LocationV4[]> =>
  getStations().then((stations) =>
    stations
      .map((station) => {
        const result: any = {};
        Object.entries(station).forEach(([key, value]) => {
          result[key] = [value];
        });
        return map(result);
      })
      .flat()
  );

function getStationCodeByCountry(
  country: string,
  station: {
    [key in keyof TrainlineStation]: any[];
  }
) {
  switch (country) {
    case "NL":
      return station.benerail_id;
    case "BE":
      return station.benerail_id;
    case "DE":
      return station.db_id;
    case "FR":
      return station.sncf_id;
    case "ES":
      return station.renfe_id;
    case "CH":
      return station.cff_id;
    case "AT":
      return station.obb_id;
    case "GB":
      return station.atoc_id;
    case "IT":
      return;
  }
}

function getTrainIds(station: {
  [key in keyof TrainlineStation]: any[];
}) {
  return new Set(
    [
      station.sncf_id,
      station.sncf_tvs_id,
      station.idtgv_id,
      station.db_id,
      station.cff_id,
      station.leoexpress_id,
      station.obb_id,
      station.ouigo_id,
      station.trenitalia_id,
      station.trenitalia_rtvt_id,
      station.ntv_rtiv_id,
      station.ntv_id,
      station.hkx_id,
      station.renfe_id,
      station.atoc_id,
      station.benerail_id,
      station.westbahn_id,
    ]
      .filter(Boolean)
      .flat()
  );
}

function getBusIds(station: {
  [key in keyof TrainlineStation]: any[];
}) {
  return new Set(
    [station.busbud_id, station.distribusion_id, station.flixbus_id]
      .filter(Boolean)
      .flat()
  );
}
