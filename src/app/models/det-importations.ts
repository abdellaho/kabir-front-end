import { Importations } from "./importations";
import { Stock } from "./stock";

export interface DetImportations {
  id: bigint;
  qteAchat: number;
  qteStock: number;
  prixAchat: number;
  importationsId: bigint;
  importations?: Importations | null;
  stockId: bigint;
  stock?: Stock | null;
}

export function initObjectDetImportations(): DetImportations {
  return {
    id: BigInt(0),
    qteAchat: 0,
    qteStock: 0,
    prixAchat: 0,
    importationsId: BigInt(0),
    importations: null,
    stockId: BigInt(0),
    stock: null,
  };
}