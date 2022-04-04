import test from "ava";
import { Label, Location } from "../../types/location";
import { matchIds } from "../../actions/match";
import { score } from "../../score";
import { score as scoreLabel } from "../../score/label";
import { closeTo } from "../test";

export const labelLanguage = test.macro({
  async exec(
    t,
    locations: Location[] | Promise<Location[]>,
    wikidata: Location[] | Promise<Location[]>,
    {
      minimumScore = 1.5,
      percentageMatch = 1,
    }: {
      minimumScore?: number;
      percentageMatch?: number;
    } = {}
  ) {
    const result: {
      notFound: Label[];
      lowScore: Label[];
      missing: Label[];
      unknownLanguage: Label[];
      wrongLanguage: any[];
      correctLanguage: Label[];
    } = {
      notFound: [],
      lowScore: [],
      missing: [],
      unknownLanguage: [],
      wrongLanguage: [],
      correctLanguage: [],
    };
    await Promise.all(
      (
        await locations
      ).map(async (location) => {
        const matches = (await wikidata).filter((feature) =>
          matchIds(feature, location)
        );

        if (!matches.length) {
          location.properties.labels.forEach((label) =>
            result.notFound.push(label)
          );
          return;
        }

        const [match, scored] = (
          await Promise.all(
            matches.map(
              async (match) =>
                [match, await score(location, match)] as [
                  Location,
                  Awaited<ReturnType<typeof score>>
                ]
            )
          )
        ).sort(
          (a, b) =>
            a[1].claims.percentage +
            a[1].coordinates.percentage -
            (b[1].claims.percentage + b[1].coordinates.percentage)
        )?.[0];

        if (
          scored.claims.percentage + scored.coordinates.percentage <
          minimumScore
        ) {
          location.properties.labels.forEach((label) =>
            result.lowScore.push(label)
          );
          return;
        }

        scored.labels.matches.forEach((m) => {
          if (m.missing) {
            result.missing.push(m);
          } else if (m.match) {
            result.correctLanguage.push(m);
          } else {
            const otherLanguage = scoreLabel(
              [{ value: m.value }],
              match.properties.labels
            );
            if (otherLanguage.percentage > scored.labels.percentage) {
              result.wrongLanguage.push({ ...m, otherLanguage });
            } else {
              result.unknownLanguage.push(m);
            }
          }
        });
      })
    );

    const correctLanguage = result.correctLanguage.length;
    const wrongLanguage = result.wrongLanguage.length;
    // if(correctLanguage / (wrongLanguage + correctLanguage) < .8)
     console.log(require('util').inspect(result, false, 8, true));
    closeTo(
      t,
      correctLanguage / (wrongLanguage + correctLanguage),
      percentageMatch
    );
  },
  title(country = "") {
    return `${country} labels should match expected language`;
  },
});
