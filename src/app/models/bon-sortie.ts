import { Employe } from "./employe";
import { Repertoire } from "./Repertoire";

export interface BonSortie {
  id: bigint;
  numSortie: number;
  codeSortie: string;
  dateOperation: Date;
  mnt: number;
  employeId: bigint;
  employe?: Employe | null;
  repertoireId: bigint;
  repertoire?: Repertoire | null;
}

export function initObjectBonSortie(): BonSortie {
  return {
    id: BigInt(0),
    numSortie: 0,
    codeSortie: "",
    dateOperation: new Date(),
    mnt: 0,
    employeId: BigInt(0),
    employe: null,
    repertoireId: BigInt(0),
    repertoire: null,
  };
}