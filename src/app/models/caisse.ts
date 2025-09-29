export interface Caisse {
  id: bigint;
  montant: number;
  dateOperation: Date;
  type: number;
}

export function initObjectCaisse(): Caisse {
  return {
    id: BigInt(0),
    montant: 0,
    dateOperation: new Date(),
    type: 0,
  };
}