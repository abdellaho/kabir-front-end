import { DetBulttinLivraison } from "./det-bulttin-livraison";
import { DetLivraison } from "./det-livraison";
import { Employe } from "./employe";
import { Repertoire } from "./Repertoire";

export interface Livraison {
  id: bigint;
  numLivraison: number;
  codeBl: string;
  dateBl: Date;
  dateReglement: Date;
  dateReglement2: Date;
  dateReglement3: Date;
  dateReglement4: Date;
  typeReglment: number;
  typeReglment2: number;
  typeReglment3: number;
  typeReglment4: number;
  mantantBL: number;
  mantantBLReel: number;
  mantantBLBenefice: number;
  typePaiement: string;
  mantantBLPourcent: number;
  reglerNonRegler: number;
  sysDate: Date;
  infinity: number;
  etatBultinPaie: number;
  livrernonlivrer: number;
  avecRemise: boolean;
  mntReglement: number;
  mntReglement2: number;
  mntReglement3: number;
  mntReglement4: number;
  facturer100: boolean;
  codeTransport: string;
  employeOperateurId: bigint;
  employeOperateur?: Employe | null;
  repertoireByCommercialId: bigint;
  repertoireByCommercial?: Repertoire | null;
  repertoireByCommercialAncienId: bigint;
  repertoireByCommercialAncien?: Repertoire | null;
  repertoireByClientId: bigint;
  repertoireByClient?: Repertoire | null;
}

export function initObjectLivraison(): Livraison {
  return {
    id: BigInt(0),
    numLivraison: 0,
    codeBl: "",
    dateBl: new Date(),
    dateReglement: new Date(),
    dateReglement2: new Date(),
    dateReglement3: new Date(),
    dateReglement4: new Date(),
    typeReglment: 0,
    typeReglment2: 0,
    typeReglment3: 0,
    typeReglment4: 0,
    mantantBL: 0,
    mantantBLReel: 0,
    mantantBLBenefice: 0,
    typePaiement: "",
    mantantBLPourcent: 0,
    reglerNonRegler: 0,
    sysDate: new Date(),
    infinity: 0,
    etatBultinPaie: 0,
    livrernonlivrer: 0,
    avecRemise: false,
    mntReglement: 0,
    mntReglement2: 0,
    mntReglement3: 0,
    mntReglement4: 0,
    facturer100: false,
    codeTransport: "",
    employeOperateurId: BigInt(0),
    employeOperateur: null,
    repertoireByCommercialId: BigInt(0),
    repertoireByCommercial: null,
    repertoireByCommercialAncienId: BigInt(0),
    repertoireByCommercialAncien: null,
    repertoireByClientId: BigInt(0),
    repertoireByClient: null,
  };
}