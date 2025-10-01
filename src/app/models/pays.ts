export interface Pays {
  id: bigint | null;
  pays: string;
}

export function initObjectPays(): Pays {
  return {
    id: null,
    pays: "",
  };
}