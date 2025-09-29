import { Ville } from "./ville";

export interface Repertoire {
  id: bigint;
  designation: string;
  contact1: string;
  contact2: string;
  tel1: string;
  tel2: string;
  tel3: string;
  adresse: string;
  email: string;
  typeRepertoire: number;
  typeReglment: number;
  ife: string;
  ice: string;
  archive: number;
  sysDate: Date;
  dateEntrer: Date;
  dateValidation: Date;
  observation: string;
  salaireParDefaut: number;
  nbrOperationClient: number;
  bloquer: number;
  mntCnss: number;
  commercialExterne: boolean;
  contactTel2: string;
  contactTel3: string;
  repertoireId?: bigint | null;
  repertoire?: Repertoire | null;
  villeId: bigint;
  ville?: Ville | null;
}

export function initObjectRepertoire(): Repertoire {
  return {
    id: BigInt(0),
    designation: "",
    contact1: "",
    contact2: "",
    tel1: "",
    tel2: "",
    tel3: "",
    adresse: "",
    email: "",
    typeRepertoire: 0,
    typeReglment: 0,
    ife: "",
    ice: "",
    archive: 0,
    sysDate: new Date(),
    dateEntrer: new Date(),
    dateValidation: new Date(),
    observation: "",
    salaireParDefaut: 0,
    nbrOperationClient: 0,
    bloquer: 0,
    mntCnss: 0,
    commercialExterne: false,
    contactTel2: "",
    contactTel3: "",
    repertoireId: BigInt(0),
    repertoire: null,
    villeId: BigInt(0),
    ville: null,
  };
}