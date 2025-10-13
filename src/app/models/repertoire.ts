import { TypePersonnel } from "@/shared/enums/type-personnel";
import { Ville } from "./ville";

export interface Repertoire {
  id: bigint | null;
  designation: string;
  login: string;
  password: string;
  cin: string;
  contact1: string;
  contact2: string;
  tel1: string;
  tel2: string;
  tel3: string;
  adresse: string;
  email: string;
  typePersonnel: TypePersonnel;
  etatComptePersonnel: boolean;
  typeRepertoire: number;
  typeReglment: number;
  ife: string;
  ice: string;
  archive: number;
  sysDate: Date;
  dateEntrer: Date;
  dateValidation: Date;
  observation: string;
  salaire: number;
  nbrOperationClient: number;
  bloquer: number;
  mntCnss: number;
  commercialExterne: boolean;
  contactTel2: string;
  contactTel3: string;
  repertoireId?: bigint | null;
  repertoire?: Repertoire | null;
  villeId: bigint | null;
  ville?: Ville | null;
}

export function initObjectRepertoire(): Repertoire {
  return {
    id: null,
    designation: "",
    cin: "",
    login: "",
    password: "",
    contact1: "",
    contact2: "",
    tel1: "",
    tel2: "",
    tel3: "",
    adresse: "",
    email: "",
    typePersonnel: TypePersonnel.NONE,
    etatComptePersonnel: false,
    typeRepertoire: 0,
    typeReglment: 0,
    ife: "",
    ice: "",
    archive: 0,
    sysDate: new Date(),
    dateEntrer: new Date(),
    dateValidation: new Date(),
    observation: "",
    salaire: 0,
    nbrOperationClient: 0,
    bloquer: 0,
    mntCnss: 0,
    commercialExterne: false,
    contactTel2: "",
    contactTel3: "",
    repertoireId: null,
    repertoire: null,
    villeId: null,
    ville: null,
  };
}