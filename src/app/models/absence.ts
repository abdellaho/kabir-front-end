import { Personnel } from "./personnel";

export interface Absence {
  id: bigint | null;
  dateAbsence: Date;
  matin: boolean;
  apresMidi: boolean;
  dateOperation: Date;
  personnelOperationId: bigint | null;
  personnelOperation?: Personnel | null;
  personnelId: bigint;
  personnel?: Personnel | null;
}

export function initObjectAbsence(): Absence {
  return {
    id: null,
    dateAbsence: new Date(),
    matin: false,
    apresMidi: false,
    dateOperation: new Date(),
    personnelOperationId: null,
    personnelOperation: null,
    personnelId: BigInt(0),
    personnel: null,
  };
}