import { Employe } from "./employe";
import { Repertoire } from "./Repertoire";

export interface Comptabilite {
  id: bigint;
  montantTTC: number;
  montantTVA: number;
  montantTVA0: number;
  montantTVA7: number;
  montantTVA10: number;
  montantTVA14: number;
  montantTVA20: number;
  montantHT: number;
  montantHT7: number;
  montantHT10: number;
  montantHT14: number;
  montantHT20: number;
  modeReglement: string;
  typeManuelAuto: number;
  typeReglement: number;
  dateFacture: Date;
  dateRegelement: Date;
  numFcture: string;
  montantDroitSupplementaire: number;
  typeRepertoire: number;
  repertoireId: bigint;
  repertoire?: Repertoire | null;
  employeOperateurId: bigint;
  employeOperateur?: Employe | null;
}

export function initObjectComptabilite(): Comptabilite {
  return {
    id: BigInt(0),
    montantTTC: 0,
    montantTVA: 0,
    montantTVA0: 0,
    montantTVA7: 0,
    montantTVA10: 0,
    montantTVA14: 0,
    montantTVA20: 0,
    montantHT: 0,
    montantHT7: 0,
    montantHT10: 0,
    montantHT14: 0,
    montantHT20: 0,
    modeReglement: "",
    typeManuelAuto: 0,
    typeReglement: 0,
    dateFacture: new Date(),
    dateRegelement: new Date(),
    numFcture: "",
    montantDroitSupplementaire: 0,
    typeRepertoire: 0,
    repertoireId: BigInt(0),
    repertoire: null,
    employeOperateurId: BigInt(0),
    employeOperateur: null,
  };
}