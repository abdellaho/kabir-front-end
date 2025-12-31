import { Stock } from "./stock";

export interface DetailBonSortie {
    id: bigint | null;
    qteSortie: number;
    mntProduit: number;
    total: number;
    bonSortieId: bigint | null;
    bonSortieCodeSortie: string;
    stockId: bigint | null;
    stockDesignation: string;
    stockQteStock: number;
    stock?: Stock | null;
}

export function initObjectDetailBonSortie(): DetailBonSortie {
  return {
    id: null,
    qteSortie: 0,
    mntProduit: 0,
    total: 0,
    bonSortieId: null,
    bonSortieCodeSortie: "",
    stockId: null,
    stockDesignation: "",
    stockQteStock: 0,
    stock: null
  };
}