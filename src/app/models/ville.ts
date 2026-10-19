export interface Ville {
  id: bigint | null;
  nomVille: string;
  nbrRepertoire: number;
}

export function initObjectVille(): Ville {
  return {
    id: null,
    nomVille: "",
    nbrRepertoire: 0,
  };
}