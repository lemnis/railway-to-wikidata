import { isEqual, uniqWith } from "lodash";
import fetch from "node-fetch";
import { lastValueFrom, tap } from "rxjs";
import { DB_API_KEY } from "../../../environment";
import { EVANumber, RiL100Identifier, StationQuery } from "../../types/stada";
import { Country } from "../../transform/country";
import {
  getAdministrativeTerritory$,
  getCachedAdministrativeTerritory,
} from "../../transform/inAdministrativeTerritory";
import { Location } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { logger, progressBar } from "../../utils/logger";
import { getDBStationCategory } from "../../transform/deutscheBahnStationCategory";
import { parse } from "csv-parse/sync";
import { Language } from "../../transform/language";

const getCoordinates = (coordinates: (EVANumber | RiL100Identifier)[]) => {
  return uniqWith(
    coordinates
      ?.map(({ geographicCoordinates }) => geographicCoordinates?.coordinates)
      .filter(Boolean)
      .map<[number, number]>((value) => [value![0], value![1]]),
    isEqual
  );
};

export const getBetriebstellen2021 = async () => {
  const raw = await fetch(
    "https://download-data.deutschebahn.com/static/datasets/betriebsstellen/DBNetz-Betriebsstellenverzeichnis-Stand2021-10.csv"
  ).then((response) => response.text());
  const csv: {
    PL: string,
    /** DB Code */
    'RL100-Code': string,
    /** Long Name */
    'RL100-Langname': string,
    /** Short Name */
    'RL100-Kurzname': string,
    /** Short Type */
    'Typ Kurz': string,
    /** Long Type */
    'Typ Lang': string,
    Betriebszustand: string,
    /** Date from */
    'Datum ab': number,
    /** Date untill */
    'Datum bis': string,
    Niederlassung: number,
    /** Responsible regional area */
    Regionalbereich: string,
    'Letzte Änderung': number
  }[] = parse(raw, {
    trim: true,
    cast: true,
    delimiter: ";",
    columns: true
  });
  console.log(csv);
};

export const getBetriebstellen2018 = async () => {
  const raw = await fetch(
    "https://download-data.deutschebahn.com/static/datasets/betriebsstellen/DBNetz-Betriebsstellenverzeichnis-Stand2018-04.csv"
  ).then((response) => response.text());
  const csv: {
    /** DB Code */
    Abk: string,
    Name: string,
    /** Short Name */
    Kurzname: string,
    /** Type */
    Typ: string,
    /** Operating status */
    'Betr-Zust': string,
    /** Unique number */
    'Primary location code': string,
    /** UIC Country Code */
    UIC: string,
    /** Responsible regional area */
    RB: string,
    /** Valid from */
    'gültig von': string,
    /** Valid until */
    'gültig bis': string,
    /** Network key */
    'Netz-Key': string,
    /** Location can be ordered on timetable */
    'Fpl-rel': string,
    /** Timetable processing limit */
    'Fpl-Gr': string
  }[] = parse(raw, {
    trim: true,
    delimiter: ";",
    columns: true
  });
  console.log(csv);
};

/**
 * @todo Add address & facility info
 * @todo Add support for matching station code with db station code
 * @todo Add variants to label (e.g. bf -> bahnhof)
 * @todo Fix & test error handling
 * @license CC-BY-4.0
 * @see https://developer.deutschebahn.com/store/apis/info?name=StaDa-Station_Data&version=v2&provider=DBOpenData
 */
export const getLocations = async (cache = true) => {
  logger.info("Getting data from DB API");
  const { result }: StationQuery = await fetch(
    "https://api.deutschebahn.com/stada/v2/stations",
    {
      headers: { Authorization: `Bearer ${DB_API_KEY}` },
    }
  )
    .then(
      (response) => response.text(),
      (error) => {
        logger.error(error, "DB API called failed");
        return "";
      }
    )
    .catch((e) => {
      logger.error(e, "huh");
      return "";
    })
    .then((response) => {
      try {
        return JSON.parse(response);
      } catch (error) {
        (error as any).text = response;
        console.log(response);
        throw error;
      }
    });

  const stationsInUse = (result || []).filter(
    (station) => station.category && station.category >= 1
  );

  if (!cache) {
    await lastValueFrom(
      getAdministrativeTerritory$(
        stationsInUse
          .filter(
            ({ mailingAddress, evaNumbers, ril100Identifiers }) =>
              mailingAddress?.city &&
              getCoordinates([
                ...(evaNumbers || []),
                ...(ril100Identifiers || []),
              ]).length
          )
          .map(({ mailingAddress, evaNumbers, ril100Identifiers }) => ({
            name: mailingAddress?.city!,
            country: Country.Germany.wikidata,
            coordinate: getCoordinates([
              ...(evaNumbers || []),
              ...(ril100Identifiers || []),
            ])?.[0],
          }))
      )
    );
  }

  const progress = progressBar(
    "Transforming DB locations",
    stationsInUse?.length
  );

  return Promise.all(
    stationsInUse.map<Promise<Location>>(
      async ({
        mailingAddress,
        evaNumbers,
        ril100Identifiers,
        name,
        category,
        number,
      }) => {
        const coordinates = getCoordinates([
          ...(ril100Identifiers || []),
          ...(evaNumbers || []),
        ]);
        const adminstrativeTerritory =
          !!mailingAddress?.city && !!coordinates.length
            ? await getCachedAdministrativeTerritory(
                mailingAddress?.city,
                Country.Germany.wikidata,
                coordinates[0]
              )
            : undefined;

        progress.tick();

        return {
          type: 'Feature',
          id: number,
          geometry: { type: "MultiPoint", coordinates },
          properties: {
            labels: name ? [{ value: name, language: Language.German[1] }] : [],
            [CodeIssuer.IBNR]:
              evaNumbers
                ?.map(({ number }) => number)
                .filter(Boolean)
                .map((number) => ({ value: number?.toString() })) || [],
            [CodeIssuer.DB]:
              ril100Identifiers
                ?.map(({ rilIdentifier }) => rilIdentifier)
                .filter(Boolean)
                .map((rilIdentifier) => ({
                  value: rilIdentifier?.replace(/ +/g, " "),
                })) || [],
            [Property.PostalCode]: [mailingAddress?.zipcode]
              .filter(Boolean)
              .map((value) => ({ value: value?.toString() })),
            [Property.Country]: [{ value: Country.Germany.wikidata }],
            ...(category
              ? {
                  [Property.DBStationCategory]: [
                    { value: getDBStationCategory(category) },
                  ],
                }
              : {}),
            ...(adminstrativeTerritory
              ? {
                  [Property.InAdministrativeTerritory]: [
                    { value: adminstrativeTerritory },
                  ],
                }
              : {}),
          },
        };
      }
    )
  );
};
