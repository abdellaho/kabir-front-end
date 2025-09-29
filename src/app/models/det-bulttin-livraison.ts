import { BulttinPai } from "./bulttin-pai";
import { Livraison } from "./livraison";

export interface DetBulttinLivraison {
  id: bigint;
  commission: number;
  commissionFixe: number;
  commsiondh: number;
  mantantcommission: number;
  benDH: number;
  rougenormal: boolean;
  bulttinPaiId: bigint;
  bulttinPai?: BulttinPai | null;
  livraisonId: bigint;
  livraison?: Livraison | null;
}

export function initObjectDetBulttinLivraison(): DetBulttinLivraison {
  return {
    id: BigInt(0),
    commission: 0,
    commissionFixe: 0,
    commsiondh: 0,
    mantantcommission: 0,
    benDH: 0,
    rougenormal: false,
    bulttinPaiId: BigInt(0),
    bulttinPai: null,
    livraisonId: BigInt(0),
    livraison: null,
  };
}