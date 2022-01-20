import { getStations } from "./index";

export const getIdMatches = async () => {
  const stations = await getStations();

  const keysToCompare = [
    "sncf_id",
    "sncf_tvs_id",
    "idtgv_id",
    "db_id",
    "busbud_id",
    "distribusion_id",
    "flixbus_id",
    "cff_id",
    "leoexpress_id",
    "obb_id",
    "ouigo_id",
    "trenitalia_id",
    "trenitalia_rtvt_id",
    "ntv_rtiv_id",
    "ntv_id",
    "hkx_id",
    "renfe_id",
    "atoc_id",
    "benerail_id",
    "westbahn_id",
    "uic",
  ];

  return keysToCompare
    .map((key) => {
      const hasUicAndKey = stations.filter((i) => i.uic && (i as any)[key]);
      const mismatches = hasUicAndKey.filter(
        (i) =>
          i.uic?.toString().slice(-5) !== (i as any)[key]?.toString().slice(-5)
      );

      const matchPercentage = Math.round(
        (100 / hasUicAndKey.length) * (hasUicAndKey.length - mismatches.length)
      );

      if (matchPercentage > 0)
        return {
          key: key.slice(0, -3),
          matchPercentage: matchPercentage / 100,
          // mismatches: mismatches.map((item) => ({
          //   [key]: (item as any)[key],
          //   uic: item.uic,
          //   name: item.name,
          // })),
        };
    })
    .filter(Boolean);
};
