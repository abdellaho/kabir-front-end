import { Ville } from "./ville";

export interface Etablissement {
  id: bigint | null;
  nom: string;
  cheminBD: string;
  tel1: string;
  tel2: string;
  tel3: string;
  fax: string;
  gsm: string;
  email: string;
  siteweb: string;
  cnss: string;
  patente: string;
  adresse: string;
  raisonSocial: string;
  ice: string;
  ife: string;
  port: number;
  hostMail: string;
  paswordMail: string;
  paswordMailFake: string;
  fromMail: string;
  userMail: string;
  capitale: number;
  pourcentageLiv: number;
  lienDbDump: string;
  lienBackupDB: string;
  lundi: boolean;
  mardi: boolean;
  mercredi: boolean;
  jeudi: boolean;
  vendredi: boolean;
  samedi: boolean;
  dimanche: boolean;
  dateTime: Date;
  typeExec: number;
  numJour: number;
  villeId: bigint | null;
  ville?: Ville | null;
}

export function initObjectEtablissement(): Etablissement {
  return {
    id: null,
    nom: "",
    cheminBD: "",
    tel1: "",
    tel2: "",
    tel3: "",
    fax: "",
    gsm: "",
    email: "",
    siteweb: "",
    cnss: "",
    patente: "",
    adresse: "",
    raisonSocial: "",
    ice: "",
    ife: "",
    port: 0,
    hostMail: "",
    paswordMail: "",
    paswordMailFake: "",
    fromMail: "",
    userMail: "",
    capitale: 0,
    pourcentageLiv: 0,
    lienDbDump: "",
    lienBackupDB: "",
    lundi: false,
    mardi: false,
    mercredi: false,
    jeudi: false,
    vendredi: false,
    samedi: false,
    dimanche: false,
    dateTime: new Date(),
    typeExec: 0,
    numJour: 0,
    villeId: null,
    ville: null,
  };
}