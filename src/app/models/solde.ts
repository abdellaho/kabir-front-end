import { PlanComptable } from "./plan-comptable";

export interface Solde {
  id: bigint;
  dateOperation: Date;
  dateReglement: Date;
  debit: number;
  credit: number;
  solde: number;
  nature: string;
  planComptableId: bigint;
  planComptable?: PlanComptable | null;
}

export function initObjectSolde(): Solde {
  return {
    id: BigInt(0),
    dateOperation: new Date(),
    dateReglement: new Date(),
    debit: 0,
    credit: 0,
    solde: 0,
    nature: "",
    planComptableId: BigInt(0),
    planComptable: null,
  };
}