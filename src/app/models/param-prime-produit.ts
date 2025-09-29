import { Stock } from "./stock";

export interface ParamPrimeProduit {
  id: bigint;
  montant: number;
  prime: number;
  stockId: bigint;
  stock?: Stock | null;
}

export function initObjectParamPrimeProduit(): ParamPrimeProduit {
  return {
    id: BigInt(0),
    montant: 0,
    prime: 0,
    stockId: BigInt(0),
    stock: null,
  };
}