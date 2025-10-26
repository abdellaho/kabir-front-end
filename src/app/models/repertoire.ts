import { Ville } from "./ville";
import { Personnel } from "./personnel";

export interface Repertoire {
  id: bigint | null;
  designation: string;
  tel1: string;
  tel2: string;
  tel3: string;
  adresse: string;
  email: string;
  typeRepertoire: number;
  typeReglment: number;
  ife: string;
  ice: string;
  archiver: boolean;
  bloquer: boolean;
  sysDate: Date;
  observation: string;
  nbrOperationClient: number;
  plafond: number;
  personnelId?: bigint | null;
  personnel?: Personnel | null;
  villeId: bigint | null;
  ville?: Ville | null;
}

export function initObjectRepertoire(): Repertoire {
  return {
    id: null,
    designation: "",
    tel1: "",
    tel2: "",
    tel3: "",
    adresse: "",
    email: "",
    typeRepertoire: 0,
    typeReglment: 0,
    ife: "",
    ice: "",
    archiver: false,
    bloquer: false,
    sysDate: new Date(),
    observation: "",
    nbrOperationClient: 0,
    plafond: 0,
    personnelId: null,
    personnel: null,
    villeId: null,
    ville: null,
  };
}