import { simplifyValue } from "./clean-up";

const geo = "http://www.opengis.net/ont/geosparql#";
const geoLiteral = `${geo}wktLiteral`;

export const simplify = (
  claims: { value: string; type: string; datatype: string }[]
) => {
  return (claims || [])
    .filter(
      ({ datatype, type }) => datatype === geoLiteral || type === "literal"
    )
    .map(({ value, type, datatype }) =>
      datatype === geoLiteral
        ? (simplifyValue(value, type, datatype) as [number, number])
        : (value
            .split(" ")
            .map((coor) => parseFloat(coor))
            .reverse() as [number, number])
    );
};
