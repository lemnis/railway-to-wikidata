/// <reference path="../../types/fptf.d.ts" />
import { point } from "@turf/turf";
import comboios from "comboios";
import { merge } from "../../actions/merge";
import { groupByScore } from "../../group/score";
import { findCountryByAlpha2 } from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";

export const getLocations = async () => {
  const rawLocations = await comboios.stations();
  const ungroupedStations = await Promise.all(
    rawLocations.map<Promise<Location>>(
      async ({ uicId, name, location: { longitude, latitude }, country, id }) =>
        point(
          [longitude, latitude],
          {
            labels: [{ value: name }],
            [CodeIssuer.UIC]: [{ value: uicId }],
            [Property.Country]: [
              { value: findCountryByAlpha2(country)?.wikidata! },
            ],
          },
          { id }
        )
    )
  );

  const groupedStations: Location[][] = await groupByScore(
    ungroupedStations,
    (score) => score?.percentage >= 1.9
  );

  return await Promise.all(
    groupedStations.map((stations) =>
      stations.length > 1 ? merge(stations, false, false) : stations[0]
    )
  );
};
