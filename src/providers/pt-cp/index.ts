/// <reference path="../../types/fptf.d.ts" />
import { point } from "@turf/turf";
import comboios from "comboios";
import { merge } from "../../actions/merge";
import { groupByScore } from "../../group/score";
import { Country, findCountryByAlpha2 } from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";

export const getLocations = async () => {
  const rawLocations = await comboios.stations();
  const ungroupedStations = rawLocations.map<Location>(
    ({ uicId, name, location: { longitude, latitude }, country, id }) => {
      const c = findCountryByAlpha2(country);
      return point(
        [longitude, latitude],
        {
          labels: [{ value: name }],
          [CodeIssuer.UIC]: [
            {
              value: uicId,
              info: {
                enabled: ["pt-cp"],
                ...(c === Country.Portugal
                  ? { slug: name.toLowerCase().replace(/ /g, "-") }
                  : {}),
              },
            },
          ],
          [Property.Country]: [{ value: c?.wikidata! }],
        },
        { id }
      );
    }
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
