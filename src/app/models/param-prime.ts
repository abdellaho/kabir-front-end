export interface ParamPrime {
  id: bigint;
  montant: number;
  prime: number;
}

export function initObjectParamPrime(): ParamPrime {
  return {
    id: BigInt(0),
    montant: 0,
    prime: 0,
  };
}