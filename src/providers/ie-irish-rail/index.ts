import { Location } from "../../types/location";
import { Property } from "../../types/wikidata";
import fetch from "node-fetch";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { Country } from "../../transform/country";
import { point } from "@turf/turf";
import { score } from "../../score";
import { merge } from "../../actions/merge";
import { feature } from "@ideditor/country-coder";

const NorthIrelandIds = [228, 238, 241, 242, 260];

export const getLocations = async () => {
  const xml = await fetch(
    "http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML"
  ).then((response) => response.text());

  if (!XMLValidator.validate(xml)) return [];

  const parser = new XMLParser();
  const {
    ArrayOfObjStation,
  }: {
    ArrayOfObjStation: {
      objStation: {
        StationDesc: string;
        StationAlias: string;
        StationLatitude: number;
        StationLongitude: number;
        StationCode: string;
        StationId: number;
      }[];
    };
  } = parser.parse(xml);

  const ungroupedStations = ArrayOfObjStation.objStation
    .filter(
      ({ StationLatitude, StationLongitude }) =>
        StationLatitude && StationLongitude
    )
    .map<Location>(
      ({
        StationAlias,
        StationCode,
        StationDesc,
        StationId: id,
        StationLatitude,
        StationLongitude,
      }) => {
        const coordinates = [StationLongitude, StationLatitude] as [
          number,
          number
        ];
        const country = feature(coordinates)?.properties.wikidata;

        return point(
          coordinates,
          {
            labels: [
              { value: StationDesc },
              ...(StationAlias ? [{ value: StationAlias }] : []),
            ],
            [Property.StationCode]: [
              { value: StationCode },
              { value: id.toString() },
            ],
            [Property.Country]: [{ value: country }],
          },
          { id }
        );
      }
    );

  const groupedStations: Location[][] = [];

  for await (const station of ungroupedStations) {
    const [index, highestMatch] =
      (await Promise.all(
        groupedStations.map((r, index) =>
          Promise.all(r.map((b) => score(station, b)))
            .then((r) => r.sort((a, b) => b.percentage - a.percentage)?.[0])
            .then(
              (r) => [index, r] as [number, Awaited<ReturnType<typeof score>>]
            )
        )
      ).then(
        (r) => r.sort((a, b) => b[1].percentage - a[1].percentage)?.[0]
      )) || [];

    // Adamstown is having a incorrect coordinate, lets manually ignore it O:)
    if (
      station.properties.labels[0].value === "Adamstown" &&
      groupedStations?.[index]?.[0]?.properties.labels[0].value === "Adamstown"
    ) {
      groupedStations[index].push(station);

      groupedStations[index].forEach((item) => {
        if (item.geometry.coordinates?.[0] === -7) {
          item.geometry = {
            coordinates: [],
            type: "MultiPoint",
          };
        }
      });
    } else if (highestMatch?.percentage >= 2) {
      groupedStations[index].push(station);
    } else {
      groupedStations.push([station]);
    }
  }

  return await Promise.all(
    groupedStations.map((stations) =>
      stations.length > 1 ? merge(stations, false, false) : stations[0]
    )
  );
};
