import { CodeIssuer, Items, Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { Country, findCountryByUIC } from "../../transform/country";
import { getGtfsStations } from "../../utils/gtfs";
import { Language } from "../../transform/language";

const stopIds = {
  "100172": Country.Hungary,
  "10033": Country.Austria,
  "100339": Country.Hungary,
  "10330": Country.Austria,
  "104471": Country.Hungary,
  "105049": Country.Hungary,
  "10736": Country.Austria,
  "11171": Country.Austria,
  "11874": Country.Austria,
  "12229": Country.Austria,
  "12302": Country.Austria,
  "12369": Country.Austria,
  "132431": Country.Hungary,
  "13623": Country.Hungary,
  "138735": Country.Austria,
  "19745": Country.Hungary,
  "21840": Country.Austria,
  "28977": Country.Austria,
  "28993": Country.Austria,
  "29611": Country.Austria,
  "29686": Country.Austria,
  "29751": Country.Austria,
  "29769": Country.Austria,
  "29975": Country.Austria,
  "30007": Country.Austria,
  "30023": Country.Austria,
  "30031": Country.Austria,
  "30049": Country.Austria,
  "31070": Country.Austria,
  "31377": Country.Germany,
  "31443": Country.Austria,
  "31856": Country.Austria,
  "331041": Country.Czech,
  "332346": Country.Czech,
  "332742": Country.Czech,
  "332957": Country.Czech,
  "334250": Country.Czech,
  "33506": Country.Poland,
  "33605": Country.Poland,
  "336248": Country.Czech,
  "336529": Country.Czech,
  "336743": Country.Czech,
  "337220": Country.Czech,
  "338459": Country.Czech,
  "339846": Country.Czech,
  "341040": Country.Czech,
  "341149": Country.Czech,
  "341248": Country.Czech,
  "343624": Country.Czech,
  "344341": Country.Czech,
  "346627": Country.Czech,
  "349241": Country.Czech,
  "351627": Country.Czech,
  "354423": Country.Czech,
  "355024": Country.Czech,
  "355750": Country.Czech,
  "361451": Country.Czech,
  "370858": Country.Czech,
  "371450": Country.Czech,
  "38653": Country.Poland,
  "40998": Country.Poland,
  "431007": Country.Slovenia,
  "434001": Country.Slovenia,
  "534149": Country.Czech,
  "536136": Country.Czech,
  "538637": Country.Czech,
  "539130": Country.Czech,
  "570762": Country.Czech,
  "571760": Country.Czech,
  "73312": Country.Poland,
  "73700": Country.Poland,
  "766600": Country.Croatia,
  "77503": Country.Poland,
  "78717": Country.Germany,
  "80630": Country.Poland,
  "82404": Country.Poland,
  "83600": Country.Poland,
  "94045": Country.Switzerland,
  "94110": Country.Switzerland,
};

/**
 * @see https://data.gov.sk/dataset/https-www-zsr-sk-files-pre-cestujucich-cestovny-poriadok-gtfs-gtfs-zip
 */
export const getLocations = async () => {
  const data = await getGtfsStations(
    "https://www.zsr.sk/files/pre-cestujucich/cestovny-poriadok/gtfs/gtfs.zip",
    "zsr"
  );

  return data.map<Location>(({ stop_lat, stop_lon, stop_name, stop_id }) => {
    const country =
      (stop_id.length === 7
        ? findCountryByUIC(parseInt(stop_id.slice(0, 2)))
        : stopIds[stop_id as keyof typeof stopIds]) || Country.Slovakia;
    const code =
      stop_id.length === 7
        ? stop_id
        : (
            country.UIC?.[0]! * 100000 +
            parseInt(stop_id.slice(-6, -1))
          ).toString();

    return {
      type: "Feature",
      id: stop_id,
      geometry: {
        type: "Point",
        coordinates: [parseFloat(stop_lon), parseFloat(stop_lat)],
      },
      properties: {
        labels: [{ value: stop_name, lang: Language.Slovak[1] }],
        ...(stop_id.length === 7
          ? { [CodeIssuer.IBNR]: [{ value: code }] }
          : { [CodeIssuer.UIC]: [{ value: code }] }),
        [Property.StationCode]: [{
          value: stop_id,
          qualifiers: {
            [Property.AppliesToPart]: [{ value: Items.ZSR }]
          }
        }],
        [Property.Country]: [{ value: country.wikidata }],
      },
    };
  });
};
