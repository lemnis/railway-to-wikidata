import { Location } from "../../types/location";
import { Property } from "../../types/wikidata";
import { rfiData } from "./rfi.data";
import { stationList } from "./stationList.data";

/**
 * Draft implementation of Trenitalia locations, no official data source.
 * Currently the data is copied from the website.
 * No license!
 */
export const getLocations = async () => {
  // Merge the 2 data sets by a very inperfect name match
  // TODO: improve matching of the 2 data sets
  const merged = rfiData.map((rfi) => ({
    ...rfi,
    stationList: stationList.find(
      (station) => rfi.ct === station.label || station.label === rfi.name
    ),
  }));

  return merged.map<Location>(({ loc, name, stationList, ct }) => ({
    type: "Feature",
    id: ct,
    geometry: {
      type: "Point",
      coordinates: [parseFloat(loc.lng), parseFloat(loc.lat)],
    },
    properties: {
      labels: [{ value: name }],
      [Property.StationCode]: [{ value: stationList?.value }],
    },
  }));
};
