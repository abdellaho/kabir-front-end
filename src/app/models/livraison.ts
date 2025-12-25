import { Employe } from "./employe";
import { Fournisseur } from "./fournisseur";
import { Personnel } from "./personnel";
import { Repertoire } from "./repertoire";

export interface Livraison {
  id: bigint | null;
  numLivraison: number;
  codeBl: string;
  dateBl: Date;
  dateReglement: Date;
  dateReglement2: Date | null;
  dateReglement3: Date | null;
  dateReglement4: Date | null;
  typeReglment: number;
  typeReglment2: number;
  typeReglment3: number;
  typeReglment4: number;
  numCheque: string;
  numCheque2: string;
  numCheque3: string;
  numCheque4: string;
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
  employeOperateurId: bigint | null;
  employeOperateur?: Employe | null;
  personnel: Personnel | null;
  personnelId: bigint;
  personnelAncien: Personnel | null;
  personnelAncienId?: bigint | null;
  repertoire: Repertoire | null;
  repertoireId: bigint;
}

export function initObjectLivraison(): Livraison {
  return {
    id: null,
    numLivraison: 0,
    codeBl: "",
    dateBl: new Date(),
    dateReglement: new Date(),
    dateReglement2: null,
    dateReglement3: null,
    dateReglement4: null,
    numCheque: "",
    numCheque2: "",
    numCheque3: "",
    numCheque4: "",
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
    employeOperateurId: null,
    employeOperateur: null,
    personnelId: BigInt(0),
    personnelAncienId: null,
    repertoireId: BigInt(0),
    personnelAncien: null,
    personnel: null,
    repertoire: null,
  };
}