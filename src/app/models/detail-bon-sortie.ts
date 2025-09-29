import { BonSortie } from "./bon-sortie";
import { Stock } from "./stock";

export interface DetailBonSortie {
  id: bigint;
  qteSortie: number;
  mntProduit: number;
  total: number;
  bonSortieId: bigint;
  bonSortie?: BonSortie | null;
  stockId: bigint;
  stock?: Stock | null;
}

export function initObjectDetailBonSortie(): DetailBonSortie {
  return {
    id: BigInt(0),
    qteSortie: 0,
    mntProduit: 0,
    total: 0,
    bonSortieId: BigInt(0),
    bonSortie: null,
    stockId: BigInt(0),
    stock: null,
  };
}