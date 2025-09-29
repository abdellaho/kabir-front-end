import { PlanComptable } from "./plan-comptable";

export interface Balance {
  id: bigint;
  dateBalance: Date;
  nature: string;
  debitPrec: number;
  creditPrec: number;
  debit: number;
  credit: number;
  soldeDebiteur: number;
  soldeCrediteur: number;
  planComptableId: bigint;
  planComptable?: PlanComptable | null;
}

export function initObjectBalance(): Balance {
  return {
    id: BigInt(0),
    dateBalance: new Date(),
    nature: "",
    debitPrec: 0,
    creditPrec: 0,
    debit: 0,
    credit: 0,
    soldeDebiteur: 0,
    soldeCrediteur: 0,
    planComptableId: BigInt(0),
    planComptable: null,
  };
}