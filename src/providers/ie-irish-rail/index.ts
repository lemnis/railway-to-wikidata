import { LocationV4 } from "../../types/location";
import { Property } from "../../types/wikidata";
import fetch from "node-fetch";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { Country } from "../../transform/country";

const NorthIrelandIds = [228, 238, 241, 242, 260];

export const getLocations = async () => {
  const xml = await fetch(
    "http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML"
  ).then((response) => response.text());

  if (!XMLValidator.validate(xml)) return [];

  const parser = new XMLParser();
  const {
    ArrayOfObjStation,
  }: {
    ArrayOfObjStation: {
      objStation: {
        StationDesc: string;
        StationAlias: string;
        StationLatitude: number;
        StationLongitude: number;
        StationCode: string;
        StationId: number;
      }[];
    };
  } = parser.parse(xml);

  return ArrayOfObjStation.objStation
    .filter(
      ({ StationLatitude, StationLongitude }) =>
        StationLatitude && StationLongitude
    )
    .map<LocationV4>(
      ({
        StationAlias,
        StationCode,
        StationDesc,
        StationId,
        StationLatitude,
        StationLongitude,
      }) => ({
        labels: [
          { value: StationDesc },
          ...(StationAlias ? [{ value: StationAlias }] : []),
        ],
        claims: {
          [Property.StationCode]: [
            { value: StationCode },
            { value: StationId.toString() },
          ],
          [Property.CoordinateLocation]: [
            { value: [StationLatitude, StationLongitude] },
          ],
          [Property.Country]: [
            {
              value: NorthIrelandIds.includes(StationId)
                ? Country.UnitedKingdom.wikidata
                : Country.Ireland.wikidata,
            },
          ],
        },
      })
    );
};
