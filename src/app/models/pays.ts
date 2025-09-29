export interface Pays {
  id: bigint;
  pays: string;
}

export function initObjectPays(): Pays {
  return {
    id: BigInt(0),
    pays: "",
  };
}