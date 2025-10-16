export interface Ville {
  id: bigint | null;
  nomVille: string;
}

export function initObjectVille(): Ville {
  return {
    id: null,
    nomVille: "",
  };
}