import { multiPoint } from "@turf/turf";
import { Location } from "../../types/location";
import { CodeIssuer } from "../../types/wikidata";
import { stations } from "./station.data";

export const getLocations = () => {
  return stations.map<Location>(({ name, id, slug }) => {
    return multiPoint([], {
      labels: [{ value: name }],
      [CodeIssuer.UIC]: [
        { value: id, info: { bgBdzSlug: slug, enabled: true } },
      ],
    });
  });
};
