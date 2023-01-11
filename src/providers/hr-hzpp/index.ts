import { point } from "@turf/turf";
import { merge } from "../../actions/merge";
import { groupByScore } from "../../group/score";
import { Country } from "../../transform/country";
import { Location } from "../../types/location";
import { Property } from "../../types/wikidata";
import { Stations } from "./hr-hzpp.data";

export const getLocations = async () => {
  const ungroupedStations = (await Stations).map<Location>(
    ({ name: id, longitude, latitude }) =>
      point(
        [longitude, latitude],
        {
          labels: [{ value: id }],
          [Property.Country]: [{ value: Country.Croatia.wikidata }],
          info: { enabled: true },
        },
        { id }
      )
  );

  const groupedStations = await groupByScore(
    ungroupedStations,
    (score) => score?.percentage >= 1.9
  );

  return await Promise.all(
    groupedStations.map((stations) =>
      stations.length > 1 ? merge(stations, false, false) : stations[0]
    )
  );
};
