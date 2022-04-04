import test from "ava";
import { CountryInfo } from "../../transform/country";
import { Location } from "../../types/location";
import { Property } from "../../types/wikidata";

export const noForeignLocations = test.macro({
  exec(t, locations: Location[], country: CountryInfo) {
    const foreignLocations = locations.filter((feature) =>
      feature.properties?.[Property.Country]?.every(
        ({ value }: any) => value !== country.wikidata
      )
    );
    t.is(foreignLocations.length, 0);
  },
  title() {
    return "Should not have any foreign locations";
  },
});
