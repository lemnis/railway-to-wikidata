declare module "slovenske-zeleznice" {
  export const stations = {
    all: () => ReadStream,
  };
}

declare module "mav" {
  export const stations: () => Promise<
    {
      type: "station";
      id: string;
      name: string;
      coordinates: {
        longitude: number;
        latitude: number;
      };
    }[]
  >;
}

declare module "comboios" {
  export const stations: () => Promise<
    {
      type: "station";
      id: string;
      uicId: string;
      name: string;
      location: {
        longitude: number;
        latitude: number;
      };
      timezone: string;
      country: string;
    }[]
  >;
}

declare module "query-overpass" {
  export default function queryOverpass(
    query: string,
    callback: (error: Error, data: import('geojson').FeatureCollection) => void,
    options?: any
  ) {}
}
