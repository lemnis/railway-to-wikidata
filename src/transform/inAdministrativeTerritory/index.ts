import { distanceTo } from "geolocation-utils";
import { concatMap, delay, from, mergeMap, of, tap } from "rxjs";
import { Property } from "../../types/wikidata";
import { db, dbIsLoaded } from "../../utils/database";
import { progressBar } from "../../utils/logger";
import { run } from "../../providers/wikidata/run";
import {
  removeUri,
  simplifyByDatatype,
} from "../../providers/wikidata/simplify";
import { search } from "../utils/mwapi";

const MAX_DISTANCE = 40000;

interface Data {
  id: string;
  coordinate: [number, number];
  name: string;
  country: string;
  coordinates: [number, number][];
}

const getCollection = async () => {
  await dbIsLoaded;

  return (
    db.getCollection<Data>(Property.InAdministrativeTerritory) ||
    db.addCollection<Data, {}>(Property.InAdministrativeTerritory)
  );
};

export const getAdministrativeTerritory$ = (
  values: { name: string; country: string; coordinate: [number, number] }[]
) => {
  const progress = progressBar(
    "Getting Administrative Territories",
    values?.length
  );

  return of(...values).pipe(
    concatMap(({ name, country, coordinate }) =>
      from(getCachedAdministrativeTerritory(name, country, coordinate)).pipe(
        mergeMap((cached) =>
          cached
            ? of(cached)
            : from(
                fetchAdministrativeTerritory(name, country, coordinate)
              ).pipe(delay(3000))
        ),
        tap(() => progress.tick())
      )
    )
  );
};

export const getAdministrativeTerritory = async (
  name: string,
  country: string,
  coordinate: [number, number]
) => {
  const cached = getCachedAdministrativeTerritory(name, country, coordinate);
  if (cached) {
    return cached;
  } else {
    return fetchAdministrativeTerritory(name, country, coordinate);
  }
};

export const getCachedAdministrativeTerritory = async (
  name: string,
  country: string,
  coordinate: [number, number]
) => {
  const cache = await getCollection();
  const cachedValues = cache.find({ name, country });
  if (cachedValues.length) {
    const [distance, closest] = cachedValues
      .map<[number, Data]>((value) => {
        const distance = distanceTo(coordinate, value.coordinate);
        return [distance, value];
      })
      .sort((a, b) => a[0] - b[0])?.[0];

    if (distance < MAX_DISTANCE) {
      // closest.coordinates.push(coordinate);
      return closest.id;
    }
  }
};

const fetchAdministrativeTerritory = async (
  name: string,
  country: string,
  coordinate: [number, number]
) => {
  const cache = await getCollection();

  const { results } =
    await run(`SELECT DISTINCT ?item ?itemLabel ?location ?order WHERE {
      ${search(name, "en", "Q15284")}                
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      ?item wdt:P625 ?location.
      ?item wdt:P17 wd:${country}
  } ORDER BY ?order`);

  let id: string;

  for (const i of results.bindings) {
    const coor = simplifyByDatatype(
      i.location.datatype,
      i.location.value
    ) as any;
    const distance = distanceTo(coor, coordinate);
    if (distance < MAX_DISTANCE) {
      id = removeUri(i.item.value);
      cache.insert({
        id,
        coordinate: coor,
        country,
        coordinates: [coordinate],
        name,
      });
      break;
    }
  }

  if (!id! && results.bindings.length) {
    for (const i of results.bindings) {
      const coor = simplifyByDatatype(
        i.location.datatype,
        i.location.value
      ) as any;
      const distance = distanceTo(coor, coordinate);
      const id = removeUri(i.item.value);
      console.log(Math.floor(distance / 1000), "km", id, name, coordinate);
    }
  }

  return id!;
};
