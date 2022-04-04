import test from "ava";
import { Label, Location } from "../../types/location";
import { matchIds } from "../../actions/match";
import { score } from "../../score";
import { score as scoreLabel } from "../../score/label";
import { closeTo } from "../test";

export const coordinateDistance = test.macro({
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
      notFound: Location[];
      lowScore: any[];
      missing: any[];
      unknown: any[];
      wrong: any[];
      correct: any[];
    } = {
      notFound: [],
      lowScore: [],
      missing: [],
      unknown: [],
      wrong: [],
      correct: [],
    };
    await Promise.all(
      (
        await locations
      ).map(async (location) => {
        const matches = (await wikidata).filter((feature) =>
          matchIds(feature, location)
        );

        if (!matches.length) {
          result.notFound.push(location)
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
            a[1].labels.percentage -
            (b[1].claims.percentage + b[1].labels.percentage)
        )?.[0];

        if (
          scored.claims.percentage + scored.labels.percentage <
          minimumScore
        ) {
          result.lowScore.push({ location, match, scored })
          return;
        }

        scored.coordinates.matches?.forEach((m) => {
          if (m.missing) {
            result.missing.push(m);
          } else if (m.match) {
            result.correct.push(m);
          } else {
            result.wrong.push(m);
          }
        });
      })
    );

    const correct = result.correct.length;
    const wrong = result.wrong.length;
    if(correct / (wrong + correct) < .8) console.log(require('util').inspect(result.wrong, false, 8, true));
    closeTo(
      t,
      correct / (wrong + correct),
      percentageMatch
    );
  },
  title(country = "") {
    return `${country} coordinates should be within range`;
  },
});
