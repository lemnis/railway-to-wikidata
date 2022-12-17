import { TrainlineStation } from "./trainline.types";

export function getTrainIds(stations: TrainlineStation[]) {
  return new Set(
    stations
      .map(({ properties }) => [
        properties.sncf_id,
        properties.sncf_tvs_id,
        properties.idtgv_id,
        properties.db_id,
        properties.cff_id,
        properties.leoexpress_id,
        properties.obb_id,
        properties.ouigo_id,
        properties.trenitalia_id,
        properties.trenitalia_rtvt_id,
        properties.ntv_rtiv_id,
        properties.ntv_id,
        properties.hkx_id,
        properties.renfe_id,
        properties.atoc_id,
        properties.benerail_id,
        properties.westbahn_id,
      ])
      .flat()
      .filter(Boolean)
      .flat()
  );
}

export function getBusIds(stations: TrainlineStation[]) {
  return new Set(
    stations
      .map(({ properties }) => [
        properties.busbud_id,
        properties.distribusion_id,
        properties.flixbus_id,
      ])
      .flat()
      .filter(Boolean)
      .flat()
  );
}

export function getAirportIds(stations: TrainlineStation[]) {
  return new Set(
    stations
      .map(({ properties }) => properties.iata_airport_code)
      .filter(Boolean)
      .flat()
  );
}
