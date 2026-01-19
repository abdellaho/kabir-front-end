import { AchatFacture } from "./achat-facture";
import { Stock } from "./stock";

export interface DetAchatFacture {
  id: bigint | null;
  uniteGratuit: number;
  qteAcheter: number;
  prixAchatHt: number;
  prixAchatTtc: number;
  remiseAchat: number;
  prixVenteTtc: number;
  mantantHt: number;
  mantantTTC: number;
  prixVenteAchatHT: number;
  beneficeDH: number;
  benePourcentage: number;
  tva20: number;
  tva7: number;
  achatFactureId: bigint | null;
  achatFactureCodeAF: string;
  stockId: bigint | null;
  stockDesignation: string;
  stockQteStock: number;
  stock: Stock | null;
}

export function initObjectDetAchatFacture(): DetAchatFacture {
  return {
    id: null,
    uniteGratuit: 0,
    qteAcheter: 0,
    prixAchatHt: 0,
    prixAchatTtc: 0,
    remiseAchat: 0,
    prixVenteTtc: 0,
    mantantHt: 0,
    mantantTTC: 0,
    prixVenteAchatHT: 0,
    beneficeDH: 0,
    benePourcentage: 0,
    tva20: 0,
    tva7: 0,
    achatFactureId: null,
    achatFactureCodeAF: '',
    stockId: null,
    stockDesignation: '',
    stockQteStock: 0,
    stock: null,
  };
}