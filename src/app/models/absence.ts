import { Employe } from "./employe";
import { Repertoire } from "./Repertoire";

export interface Absence {
  id: bigint;
  dateAbsence: Date;
  matin: boolean;
  apresMidi: boolean;
  dateOperation: Date;
  employeOperationId: bigint;
  employeOperation?: Employe | null;
  penalite: number;
  repertoireId: bigint;
  repertoire?: Repertoire | null;
}

export function initObjectAbsence(): Absence {
  return {
    id: BigInt(0),
    dateAbsence: new Date(),
    matin: false,
    apresMidi: false,
    dateOperation: new Date(),
    employeOperationId: BigInt(0),
    employeOperation: null,
    penalite: 0,
    repertoireId: BigInt(0),
    repertoire: null,
  };
}