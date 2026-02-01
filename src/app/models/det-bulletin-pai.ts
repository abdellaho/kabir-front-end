import { Stock } from "./stock";

export interface DetBulletinPai {
  id: bigint | null;
  prixlivraison: number;
  qtevendu: number;
  prixvente: number;
  remise: number;
  mantantvendu: number;
  commission: number;
  commsiondh: number;
  mantant: number;
  benDH: number;
  commissionFixe: number;
  prixCommercial: number;
  primeCommercial: number;
  primeProduit: number;
  avecZero: boolean;
  bulletinPaiId: bigint | null;
  produitId: bigint | null;
  produitDesignation: string;
  produitPattc: number;
  produitPvttc: number;
  produitQteStock: number;
  stock?: Stock;
}

export function initObjectDetBulletinPai(): DetBulletinPai {
  return {
    id: null,
    prixlivraison: 0,
    qtevendu: 0,
    prixvente: 0,
    remise: 0,
    mantantvendu: 0,
    commission: 0,
    commsiondh: 0,
    mantant: 0,
    benDH: 0,
    commissionFixe: 0,
    prixCommercial: 0,
    primeCommercial: 0,
    primeProduit: 0,
    avecZero: false,
    bulletinPaiId: null,
    produitId: null,
    produitDesignation: "",
    produitPattc: 0,
    produitPvttc: 0,
    produitQteStock: 0,
  };
}