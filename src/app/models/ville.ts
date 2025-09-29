import { Pays } from "./pays";

export interface Ville {
  id: bigint;
  nomVille: string;
  paysId: bigint;
  pays?: Pays | null;
}

export function initObjectVille(): Ville {
  return {
    id: BigInt(0),
    nomVille: "",
    paysId: BigInt(0),
    pays: null,
  };
}