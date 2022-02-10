import { Country, findCountryByUIC } from "../../transform/country";
import { LocationV4 } from "../../types/location";
import { CodeIssuer, Property } from "../../types/wikidata";
import { getGtfsStations, getGtfsStationsByRailRoute } from "../../utils/gtfs";

const defaultFilter = ({ parent_station }: any) => !parent_station;

const getNavitiaGtfsLocations =
  (
    url: string,
    name: string,
    filter?: (arg: { stop_id: string }) => boolean,
    map?: (arg: { stop_id: string }) => string
  ) =>
  () =>
    getGtfsStations(url, name).then((data) =>
      data
        .filter(filter || defaultFilter)
        .map<LocationV4>(({ stop_lat, stop_lon, stop_name, stop_id }) => {
          const code = map ? map({ stop_id }) : stop_id;
          return {
            labels: [{ value: stop_name }],
            claims: {
              [CodeIssuer.UIC]: [{ value: code }],
              // [Property.Country]: [
              //   { value: findCountryByUIC(parseInt(uic[0] + uic[1]))?.wikidata },
              // ],
              [Property.CoordinateLocation]: [
                { value: [parseFloat(stop_lat), parseFloat(stop_lon)] },
              ],
            },
          };
        })
    );

export const countries = {
  poland: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/pl/files/e95d7613de79a01387c076e2b7f24df2/download/",
    "poland"
  ),
  czech: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/cz/files/b216d1388298574009b360c687ee0175/download/",
    "czech"
  ),
  "united-kingdom": getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/uk/files/f0f6f7ef3d11365d499a8a3b15293f18/download/",
    "united-kingdom"
  ),
  spain: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/es/files/8292b012d90fb449a70edc81fbad2d73/download/",
    "spain"
  ),
  italy: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/it/files/d926270a58051b16ad2514d7ce677a0e/download/",
    "italy"
  ),
  sweden: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/se/files/2f663303beda05d3e80b127c55322c29/download/",
    "sweden"
  ),
  finland: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/fi/files/d257570da09195074b146478a1cca45c/download/",
    "finland"
  ),
  hungary: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/hu/files/a0aabfc65e9161c3c9870977ae4fbc05/download/",
    "naviita-hungary"
  ),
  switzerland: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/ch/files/11313aaed81770842b2bfade9d4aab44/download/",
    "navitia-switzerland"
  ),
  portugal: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/portugal/files/41d3174d323d59b270683a2b3f1245f2/download/",
    "navitia-portugal"
  ),
  ireland: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/ie/files/bd35581db3c32c79b1047a57dfa45a6d/download/",
    "navitia-ireland",
    ({ stop_id }) => stop_id.startsWith("OIR:Navitia:")
  ),
  estonia: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/ee/files/9da44e190878b91c4baf1ec507663ac9/download/",
    "navitia-estonia"
  ),
  denmark: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/dk/files/cd101cb21930a2b26531eaa99b48b606/download/",
    "navitia-denmark",
    ({ stop_id }) =>
      [
        ...Country.Denmark.UIC.map((code) => `${code}0`),
        ...Country.Germany.UIC,
        ...Country.Sweden.UIC,
      ]
        .map((uic) => `ODK:Navitia:00000${uic}`)
        .some((i) => stop_id.startsWith(i)),
    ({ stop_id }) => stop_id.slice(-7)
  ),
  belgium: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/be/files/42a0f2d4007f38ff35c5188d499d8a77/download/",
    "navitia-belgium",
    ({ stop_id }) => stop_id.startsWith("BSN:S")
  ),
  netherlands: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/nl/files/f4456114358e487bedc16036adaf0478/download/",
    "navitia-netherlands"
  ),
  luxembourg: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/lu/files/0e64bed084e42d1642b3387069deaa29/download/",
    "navitia-luxembourg"
  ),
  germany: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/de/files/1c3235e0d5013bf1501429cbb5267ab6/download/",
    "navitia-germany"
  ),
  "france-north-east": getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/fr-ne/files/a195d28e49f51f315d527e266cd3d124/download/",
    "navitia-france-north-east"
  ),
  "france-north-west": getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/fr-nw/files/e5b3dddb45bb3f8dbeb4c8dcbf7624ee/download/",
    "navitia-france-north-west"
  ),
  "france-south-east": getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/fr-se/files/1ca6a582346f846728c1138c92f1de36/download/",
    "navitia-france-south-east"
  ),
  "france-south-west": getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/fr-sw/files/233a49a3667ccbff85623e400b3ea969/download/",
    "navitia-france-south-west"
  ),
  norway: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/norway/files/44369c530dd5653b1cd01bbf85b26cf7/download/",
    "navitia-norway"
  ),
  serbia: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/rs/files/2ce98e1ed157834ab86f1e2f48dc4fac/download/",
    "navitia-serbia"
  ),
  austria: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/at/files/697a43e228e6bb282629ef3da5adf058/download/",
    "navitia-austria"
  ),
  russia: getNavitiaGtfsLocations(
    "https://navitia.opendatasoft.com/explore/dataset/ru/files/4e6a487012ec86c0f01cfbd5e02b7bfa/download/",
    "navitia-russia"
  ),
};
