import { simplifyValue } from "./clean-up";

export const simplify = (
  claims: { value: string; type: string; datatype: string }[]
) => {
  return (claims || [])
    .filter(
      ({ datatype }) =>
        datatype === "http://www.opengis.net/ont/geosparql#wktLiteral"
    )
    .map(
      ({ value, type, datatype }) =>
        simplifyValue(value, type, datatype) as [number, number]
    );
};
