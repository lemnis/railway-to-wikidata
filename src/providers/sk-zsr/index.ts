import { CodeIssuer, Items, Property } from "../../types/wikidata";
import { Location } from "../../types/location";
import { Country } from "../../transform/country";
import { getGtfsStations } from "../../utils/gtfs";
import { Language } from "../../transform/language";
import { point } from "@turf/turf";
import { feature } from "@ideditor/country-coder";

/**
 * @see https://data.gov.sk/dataset/https-www-zsr-sk-files-pre-cestujucich-cestovny-poriadok-gtfs-gtfs-zip
 */
export const getLocations = async () => {
  const data = await getGtfsStations(
    "https://www.zsr.sk/files/pre-cestujucich/cestovny-poriadok/gtfs/gtfs.zip",
    "zsr"
  );

  return data.map<Location>(({ stop_lat, stop_lon, stop_name, stop_id }) => {
    const coordinates: [number, number] = [
      parseFloat(stop_lon),
      parseFloat(stop_lat),
    ];
    const country = Object.values(Country).find(
      (i) => i.wikidata === feature(coordinates)?.properties.wikidata
    );
    const code =
      stop_id.length === 7
        ? stop_id
        : (
            country?.UIC?.[0]! * 100000 +
            parseInt(stop_id.slice(-6, -1))
          ).toString();

    return point(
      coordinates,
      {
        labels: [{ value: stop_name, lang: Language.Slovak[1] }],
        ...(stop_id.length === 7
          ? { [CodeIssuer.IBNR]: [{ value: code }] }
          : { [CodeIssuer.UIC]: [{ value: code }] }),
        ...(country?.wikidata === Country.Slovakia?.wikidata
          ? {
              [Property.StationCode]: [
                {
                  value: stop_id,
                  qualifiers: {
                    [Property.AppliesToPart]: [{ value: Items.ZSR }],
                  },
                },
              ],
            }
          : {}),
        ...(country
          ? { [Property.Country]: [{ value: country?.wikidata }] }
          : {}),
      },
      { id: stop_id }
    );
  });
};
