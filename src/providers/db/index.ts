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
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { logger, progressBar } from "../../utils/logger";
import { getDBStationCategory } from "../../transform/deutscheBahnStationCategory";

const getCoordinates = (coordinates: (EVANumber | RiL100Identifier)[]) => {
  return uniqWith(
    coordinates
      ?.map(({ geographicCoordinates }) => geographicCoordinates?.coordinates)
      .filter(Boolean)
      .map<[number, number]>((value) => [value![1], value![0]]),
    isEqual
  );
};

/**
 * @todo Add address & facility info
 * @todo Add support for matching station code with db station code
 * @todo Add variants to label (e.g. bf -> bahnhof)
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
    stationsInUse.map<Promise<LocationV4>>(
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
          id: number?.toString(),
          claims: {
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
            [Property.CoordinateLocation]: coordinates.map((value) => ({
              value,
            })),
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
          labels: name ? [{ value: name }] : [],
        };
      }
    )
  );
};
