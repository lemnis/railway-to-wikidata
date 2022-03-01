import { CodeIssuer, Property } from "../../types/wikidata";
import { LocationV4 } from "../../types/location";
import { Country, findCountryByUIC } from "../../transform/country";
import { getGtfsStations } from "../../utils/gtfs";

const stopIds = {
  "100172": Country.Hungary,
  "10330": Country.Austria,
  "104471": Country.Hungary,
  "11171": Country.Germany,
  "12369": Country.Austria,
  "13623": Country.Hungary,
  "138735": Country.Austria,
  "21840": Country.Austria,
  "31070": Country.Austria,
  "31377": Country.Germany,
  "31856": Country.Austria,
  "332346": Country.Czech,
  "332742": Country.Czech,
  "332957": Country.Czech,
  "336248": Country.Czech,
  "336743": Country.Czech,
  "338459": Country.Czech,
  "343624": Country.Czech,
  "349241": Country.Czech,
  "355024": Country.Czech,
  "370858": Country.Czech,
  "371450": Country.Czech,
  "38653": Country.Poland,
  "431007": Country.Czech,
  "534149": Country.Czech,
  "73312": Country.Poland,
  "73700": Country.Poland,
  "77503": Country.Poland,
  "80630": Country.Poland,
  "82404": Country.Poland,
};

/**
 * @see https://data.gov.sk/dataset/https-www-zsr-sk-files-pre-cestujucich-cestovny-poriadok-gtfs-gtfs-zip
 */
export const getLocations = async () => {
  const data = await getGtfsStations(
    "https://www.zsr.sk/files/pre-cestujucich/cestovny-poriadok/gtfs/gtfs.zip",
    "zsr"
  );

  return data.map<LocationV4>(({ stop_lat, stop_lon, stop_name, stop_id }) => {
    const country =
      (stop_id.length === 7
        ? findCountryByUIC(parseInt(stop_id.slice(0, 2)))
        : stopIds[stop_id as keyof typeof stopIds]) ||
      Country.Slovakia;
    return {
      id: stop_id,
      labels: [{ value: stop_name }],
      claims: {
        [CodeIssuer.UIC]: [
          {
            value:
              stop_id.length === 7
                ? stop_id
                : (
                    country.UIC?.[0]! * 100000 +
                    parseInt(stop_id.slice(0, 5))
                  ).toString(),
          },
        ],
        [Property.Country]: [{ value: country.wikidata }],
        [Property.CoordinateLocation]: [
          { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
        ],
      },
    };
  });
};
