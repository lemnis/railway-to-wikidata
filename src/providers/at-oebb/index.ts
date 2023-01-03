import { CodeIssuer, Property } from "../../types/wikidata";
import { Location, LocationProperties } from "../../types/location";
import { Country } from "../../transform/country";
import { getGtfsStations } from "../../utils/gtfs";
import { Language } from "../../transform/language";
import { ReliabilityOebb } from "./oebb.constants";
import { feature } from "@ideditor/country-coder";
import { point } from "@turf/turf";

/**
 * @version 2018.06.26
 * @license CC-BY-4.0
 * @see https://data.oebb.at/oebb
 */
export const getLocations = (): Promise<Location[]> =>
  getGtfsStations(
    "https://data.oebb.at/oebb?dataset=uddi:cd36722f-1b9a-11e8-8087-b71b4f81793a&file=uddi:d3e25791-7889-11e8-8fc8-edb0b0e1f0ef/GFTS_Fahrplan_OEBB.zip",
    "oebb"
  ).then((data) =>
    data.map<Location>(({ stop_lat, stop_lon, stop_name, stop_id }) => {
      const coordinates = [parseFloat(stop_lon), parseFloat(stop_lat)];
      const country = feature(coordinates as [number, number])?.properties
        .wikidata;

      return point<LocationProperties>(
        coordinates,
        {
          labels: [{ value: stop_name, lang: Language.German[1] }],
          [CodeIssuer.IBNR]: [
            {
              value: stop_id,
              info: {
                reliability:
                  country === Country.Austria.wikidata
                    ? ReliabilityOebb.Austria[CodeIssuer.IBNR]
                    : ReliabilityOebb.Foreign[CodeIssuer.IBNR],
              },
            },
          ],
          [Property.Country]: [{ value: country }],
        },
        { id: stop_id }
      );
    })
  );
