export interface GtfsStops {
  stop_id: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
  location_type?: string;
  wheelchair_boarding?: "0" | "1" | "2";
  parent_station?: string;
}
