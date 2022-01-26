export interface RenfeStation {
  code: string;
  description: string;
  latitud: string;
  longitud: string;
  direccion: string;
  postalCode: string;
  adminstartiveArea: string;
  province: string;
  country: "Francia" | "España" | "Portugal";
  cercanias: "SI" | "NO";
  feve: "SI" | "NO";
}
