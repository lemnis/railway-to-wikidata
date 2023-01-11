import { score } from "../score";
import { Location } from "../types/location";

type Score = Awaited<ReturnType<typeof score>>;

export const groupByScore = async (
  ungroupedStations: Location[],
  push: (score: Score) => boolean
) => {
  const groupedStations: Location[][] = [];

  for await (const station of ungroupedStations) {
    const [index, highestMatch] =
      (await Promise.all(
        groupedStations.map((r, index) =>
          Promise.all(r.map((b) => score(station, b)))
            .then((r) => r.sort((a, b) => b.percentage - a.percentage)?.[0])
            .then((r) => [index, r] as [number, Score])
        )
      ).then(
        (r) => r.sort((a, b) => b[1].percentage - a[1].percentage)?.[0]
      )) || [];

    if (push(highestMatch)) {
      groupedStations[index].push(station);
    } else {
      groupedStations.push([station]);
    }
  }

  return groupedStations;
};
