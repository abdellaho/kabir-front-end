export interface CompteCaisse {
  id: bigint;
  date: Date;
  designation: string;
  numFacture: string;
  montant: number;
  compteCaisse: boolean;
}

export function initObjectCompteCaisse(): CompteCaisse {
  return {
    id: BigInt(0),
    date: new Date(),
    designation: "",
    numFacture: "",
    montant: 0,
    compteCaisse: false,
  };
}