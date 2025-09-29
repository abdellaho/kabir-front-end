import { Repertoire } from "./Repertoire";

export interface Stock {
  id: bigint;
  designation: string;
  sysDate: Date;
  pahtGrossiste: number;
  prixCommercial: number;
  tva: number;
  pattc: number;
  pvttc: number;
  pvaht: number;
  benifice: number;
  qteStock: number;
  qtePVMin: number;
  qtePVMin3: number;
  qtePVMin4: number;
  qteFacturer: number;
  prixVentMin1: number;
  prixVentMin2: number;
  prixVentMin3: number;
  prixVentMin4: number;
  remiseMax: number;
  remiseMax2: number;
  remiseMax3: number;
  remiseMax4: number;
  prixImport: number;
  commission: number;
  archiver: number;
  qteStockImport: number;
  avecRemise: boolean;
  prixAchatBiggerPrixVente: boolean;
  facturer100: boolean;
  promotion1: string;
  promotion2: string;
  repertoireId: bigint;
  repertoire?: Repertoire | null;
}

export function initObjectStock(): Stock {
  return {
    id: BigInt(0),
    designation: "",
    sysDate: new Date(),
    pahtGrossiste: 0,
    prixCommercial: 0,
    tva: 0,
    pattc: 0,
    pvttc: 0,
    pvaht: 0,
    benifice: 0,
    qteStock: 0,
    qtePVMin: 0,
    qtePVMin3: 0,
    qtePVMin4: 0,
    qteFacturer: 0,
    prixVentMin1: 0,
    prixVentMin2: 0,
    prixVentMin3: 0,
    prixVentMin4: 0,
    remiseMax: 0,
    remiseMax2: 0,
    remiseMax3: 0,
    remiseMax4: 0,
    prixImport: 0,
    commission: 0,
    archiver: 0,
    qteStockImport: 0,
    avecRemise: false,
    prixAchatBiggerPrixVente: false,
    facturer100: false,
    promotion1: "",
    promotion2: "",
    repertoireId: BigInt(0),
    repertoire: null,
  };
}