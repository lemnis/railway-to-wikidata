import { simplifyValue } from "./clean-up";

export const simplify = (claims: { value: string; [key: string]: any }[]) => {
  return (claims || [])
    .filter(
      ({ dataType }) =>
        dataType === "http://www.opengis.net/ont/geosparql#wktLiteral"
    )
    .map(
      ({ value, type, dataType }) =>
        simplifyValue(value, type, dataType) as [number, number]
    );
};
