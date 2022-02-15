import { LocationV4 } from "../types/location";

export const mergeMultipleEntities = (entities: LocationV4[]) => {
  return entities.reduce<LocationV4>(
    (result, entity) => {
      let claimsKey: keyof LocationV4["claims"];
      for (claimsKey in entity.claims) {
        if (Object.prototype.hasOwnProperty.call(entity.claims, claimsKey)) {
          const values = (entity.claims)[claimsKey];
          if(!values?.length) continue;
          values.forEach((value: any) => {
            if (value === undefined) return;
            result.claims[claimsKey] ||= [];
            if (!result.claims[claimsKey]!.includes(value)) {
              result.claims[claimsKey]!.push(value);
            }
          });
        }
      }

      entity.labels.forEach((label) => {
        if (
          !result.labels.some(
            (b) => label.value === b.value && label.lang === b.lang
          )
        ) {
          result.labels.push(label);
        }
      });

      if (entity.info) {
        const { pregrouped, ...clone } = entity.info;
        result.info ||= {};
        result.info!.pregrouped ||= [];
        result.info!.pregrouped.push(clone);
      }
      return result;
    },
    { labels: [], claims: {} }
  );
};
