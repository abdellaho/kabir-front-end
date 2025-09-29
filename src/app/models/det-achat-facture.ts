import { AchatFacture } from "./achat-facture";
import { Stock } from "./stock";

export interface DetAchatFacture {
  id: bigint;
  unitegratuit: number;
  qteacheter: number;
  prixAchatHt: number;
  prixAchatTtc: number;
  remiseAchat: number;
  prixVenteTtc: number;
  mantantHt: number;
  mantantTTC: number;
  prixVenteAchatHT: number;
  beneficeDH: number;
  benepourcentage: number;
  tva20: number;
  tva7: number;
  achatFactureId: bigint;
  achatFacture?: AchatFacture | null;
  stockId: bigint;
  stock?: Stock | null;
}

export function initObjectDetAchatFacture(): DetAchatFacture {
  return {
    id: BigInt(0),
    unitegratuit: 0,
    qteacheter: 0,
    prixAchatHt: 0,
    prixAchatTtc: 0,
    remiseAchat: 0,
    prixVenteTtc: 0,
    mantantHt: 0,
    mantantTTC: 0,
    prixVenteAchatHT: 0,
    beneficeDH: 0,
    benepourcentage: 0,
    tva20: 0,
    tva7: 0,
    achatFactureId: BigInt(0),
    achatFacture: null,
    stockId: BigInt(0),
    stock: null,
  };
}