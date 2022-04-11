import { Reliability } from "../../score/reliability";
import { Country, CountryInfo } from "../../transform/country";
import { CodeIssuer, Property } from "../../types/wikidata";

export const SCORE: Record<
  string,
  Partial<Record<CodeIssuer | Property, number>>
> = {
  [Country.Austria.wikidata]: { [Property.StationCode]: .8 },
  [Country.Belgium.wikidata]: { [Property.StationCode]: .9 },
  [Country.Bulgaria.wikidata]: { [CodeIssuer.UIC]: 0.85 },
  [Country.Croatia.wikidata]: { [CodeIssuer.UIC]: 0.8 },
  [Country.Czech.wikidata]: { [CodeIssuer.UIC]: 1 },
  [Country.Finland.wikidata]: { [CodeIssuer.UIC]: 1 },
  [Country.Germany.wikidata]: { [CodeIssuer.DB]: 1 },
  [Country.Italy.wikidata]: { [CodeIssuer.UIC]: 1 },
  [Country.Netherlands.wikidata]: { [Property.StationCode]: 0.95 },
  [Country.Norway.wikidata]: { [CodeIssuer.UIC]: 1 },
  [Country.Poland.wikidata]: { [CodeIssuer.UIC]: 0.95 },
  [Country.Portugal.wikidata]: { [CodeIssuer.UIC]: 0.85 },
  [Country.Romania.wikidata]: { [CodeIssuer.UIC]: 1 },
  [Country.Slovakia.wikidata]: { [CodeIssuer.UIC]: 0.7 },
  [Country.Slovenia.wikidata]: { [CodeIssuer.UIC]: 0.9 },
  [Country.Spain.wikidata]: { [CodeIssuer.UIC]: 1 },
  [Country.Sweden.wikidata]: { [Property.StationCode]: 1 },
  [Country.Switzerland.wikidata]: { [CodeIssuer.UIC]: 0.95 },
  [Country.UnitedKingdom.wikidata]: { [CodeIssuer.ATOC]: 1 },
};

export const SMALL_DATA_SET: CountryInfo[] = [
  Country.Bulgaria,
  Country.Croatia,
  Country.Romania,
  Country.Slovenia,
  Country.Slovakia,
  Country.Poland,
];

export const getReliabilityScore = (country: CountryInfo) => {
  return Object.entries(SCORE[country.wikidata]).reduce<Record<string, number>>(
    (result, [key, value]) => {
      result[key] =
        Reliability.START +
        (Reliability.THIRD_PARTY +
          (SMALL_DATA_SET.includes(country)
            ? Reliability.SMALL_DATA_SET
            : Reliability.BIG_DATA_SET) +
          Reliability.RAW * value);
      return result;
    },
    {}
  );
};
