import { multiPoint } from "@turf/turf";
import { Country } from "../../transform/country";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { stations } from "./station.data";

export const getLocations = () =>
  stations.map<Location>(({ name, id, slug }) =>
    multiPoint(
      [],
      {
        labels: [{ value: name }],
        [CodeIssuer.UIC]: [{ value: id }],
        [Property.Country]: [{ value: Country.Bulgaria.wikidata }],
        info: { slug: slug, enabled: ["bg-bdz"], source: "bg-bdz" },
      },
      { id }
    )
  );
