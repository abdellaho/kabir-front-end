import { BulttinPai } from "./bulttin-pai";
import { Stock } from "./stock";

export interface DetBulttinPai {
  id: bigint;
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
  bulttinPaiId: bigint;
  bulttinPai?: BulttinPai | null;
  produitId: bigint;
  produit?: Stock | null;
}

export function initObjectDetBulttinPai(): DetBulttinPai {
  return {
    id: BigInt(0),
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
    bulttinPaiId: BigInt(0),
    bulttinPai: null,
    produitId: BigInt(0),
    produit: null,
  };
}