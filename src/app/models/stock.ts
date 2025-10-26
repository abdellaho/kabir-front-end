import { Fournisseur } from "./fournisseur";

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
  qtePVMin1: number;
  qtePVMin2: number;
  qtePVMin3: number;
  qtePVMin4: number;
  qteFacturer: number;
  prixVentMin1: number;
  prixVentMin2: number;
  prixVentMin3: number;
  prixVentMin4: number;
  remiseMax1: number;
  remiseMax2: number;
  remiseMax3: number;
  remiseMax4: number;
  prixImport: number;
  commission: number;
  archiver: boolean;
  qteStockImport: number;
  montant1: number;
  montant2: number;
  montant3: number;
  prime1: number;
  prime2: number;
  prime3: number;
  fournisseurId: bigint;
  fournisseur?: Fournisseur | null;
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
    qtePVMin1: 0,
    qtePVMin2: 0,
    qtePVMin3: 0,
    qtePVMin4: 0,
    qteFacturer: 0,
    prixVentMin1: 0,
    prixVentMin2: 0,
    prixVentMin3: 0,
    prixVentMin4: 0,
    remiseMax1: 0,
    remiseMax2: 0,
    remiseMax3: 0,
    remiseMax4: 0,
    prime1: 0,
    prime2: 0,
    prime3: 0,
    montant1: 0,
    montant2: 0,
    montant3: 0,
    prixImport: 0,
    commission: 0,
    archiver: false,
    qteStockImport: 0,
    fournisseurId: BigInt(0),
    fournisseur: null,
  };
}