import { AchatLivraison } from "./achat-livraison";
import { Stock } from "./stock";

export interface DetAchatLivraison {
  id: bigint;
  unitegratuit: number;
  qteacheter: number;
  prixAchatHt: number;
  prixAchatTtc: number;
  remiseAchat: number;
  prixVenteAchatHT: number;
  prixVenteTtc: number;
  mantantHt: number;
  mantantTTC: number;
  tva7: number;
  tva20: number;
  tva14: number;
  tva10: number;
  beneficeDH: number;
  benepourcentage: number;
  achatLivraisonId: bigint;
  achatLivraison?: AchatLivraison | null;
  stockId: bigint;
  stock?: Stock | null;
}

export function initObjectDetAchatLivraison(): DetAchatLivraison {
  return {
    id: BigInt(0),
    unitegratuit: 0,
    qteacheter: 0,
    prixAchatHt: 0,
    prixAchatTtc: 0,
    remiseAchat: 0,
    prixVenteAchatHT: 0,
    prixVenteTtc: 0,
    mantantHt: 0,
    mantantTTC: 0,
    tva7: 0,
    tva20: 0,
    tva14: 0,
    tva10: 0,
    beneficeDH: 0,
    benepourcentage: 0,
    achatLivraisonId: BigInt(0),
    achatLivraison: null,
    stockId: BigInt(0),
    stock: null,
  };
}