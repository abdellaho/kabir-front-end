import { Employe } from "./employe";
import { Repertoire } from "./Repertoire";

export interface Importations {
  id: bigint;
  codeFacture: string;
  devisEuroDolar: string;
  numFacture: number;
  dateFacture: Date;
  sysDate: Date;
  dateAvances1: Date;
  mantantAvancs1: number;
  dateAvances2: Date;
  mantantAvancs2: number;
  totalPaye: number;
  mntFacture: number;
  mntDouane: number;
  mntTransport: number;
  mntTransportIntern: number;
  mntTransit: number;
  mntMagasinage: number;
  prixAchatDetaille: number;
  totalAllMnt: number;
  repertoireFourId: bigint;
  repertoireFour?: Repertoire | null;
  employeOperateurId: bigint;
  employeOperateur?: Employe | null;
}

export function initObjectImportations(): Importations {
  return {
    id: BigInt(0),
    codeFacture: "",
    devisEuroDolar: "",
    numFacture: 0,
    dateFacture: new Date(),
    sysDate: new Date(),
    dateAvances1: new Date(),
    mantantAvancs1: 0,
    dateAvances2: new Date(),
    mantantAvancs2: 0,
    totalPaye: 0,
    mntFacture: 0,
    mntDouane: 0,
    mntTransport: 0,
    mntTransportIntern: 0,
    mntTransit: 0,
    mntMagasinage: 0,
    prixAchatDetaille: 0,
    totalAllMnt: 0,
    repertoireFourId: BigInt(0),
    repertoireFour: null,
    employeOperateurId: BigInt(0),
    employeOperateur: null,
  };
}