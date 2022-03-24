import { TrainlineStation } from "./trainline.types";

export function getStationCodeByCountry(
  country: string,
  station: TrainlineStation
) {
  switch (country) {
    case "NL":
      return station.benerail_id;
    case "BE":
      return station.benerail_id;
    case "DE":
      return station.db_id;
    case "FR":
      return station.sncf_id;
    case "ES":
      return station.renfe_id;
    case "CH":
      return station.cff_id;
    case "AT":
      return station.obb_id;
    case "GB":
      return station.atoc_id;
    case "IT":
      return;
  }
}

export function getTrainIds(stations: TrainlineStation[]) {
  return new Set(
    stations
      .map((station) => [
        station.sncf_id,
        station.sncf_tvs_id,
        station.idtgv_id,
        station.db_id,
        station.cff_id,
        station.leoexpress_id,
        station.obb_id,
        station.ouigo_id,
        station.trenitalia_id,
        station.trenitalia_rtvt_id,
        station.ntv_rtiv_id,
        station.ntv_id,
        station.hkx_id,
        station.renfe_id,
        station.atoc_id,
        station.benerail_id,
        station.westbahn_id,
      ])
      .flat()
      .filter(Boolean)
      .flat()
  );
}

export function getBusIds(stations: TrainlineStation[]) {
  return new Set(
    stations
      .map((station) => [
        station.busbud_id,
        station.distribusion_id,
        station.flixbus_id,
      ])
      .flat()
      .filter(Boolean)
      .flat()
  );
}
