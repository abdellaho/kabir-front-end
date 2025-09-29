import { Employe } from "./employe";
import { Repertoire } from "./Repertoire";

export interface Cheque {
  id: bigint;
  numero: string;
  codeCheque: string;
  dateCheque: Date;
  typeRepertoire: number;
  montant: number;
  typePersoScte: number;
  numCheque: number;
  etatcheque: boolean;
  typeReglment: number;
  repertoireId: bigint;
  repertoire?: Repertoire | null;
  employeOperateurId: bigint;
  employeOperateur?: Employe | null;
}

export function initObjectCheque(): Cheque {
  return {
    id: BigInt(0),
    numero: "",
    codeCheque: "",
    dateCheque: new Date(),
    typeRepertoire: 0,
    montant: 0,
    typePersoScte: 0,
    numCheque: 0,
    etatcheque: false,
    typeReglment: 0,
    repertoireId: BigInt(0),
    repertoire: null,
    employeOperateurId: BigInt(0),
    employeOperateur: null,
  };
}