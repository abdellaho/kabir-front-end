import { Repertoire } from "./Repertoire";

export interface Employe {
  id: bigint;
  numEmp: number;
  livrerNonLivrerDroit: number;
  codeEmp: string;
  nom: string;
  prenom: string;
  login: string;
  motpass: string;
  email: string;
  typeUser: number;
  etatCompte: boolean;
  validationMnt: number;
  motPassFake: string;
  commercial: boolean;
  pvLibre: boolean;
  gerant: boolean;
  magasinier: boolean;
  bulltinPaie: boolean;
  imprimStockSimple: boolean;
  livraisonLimite: boolean;
  repertoireId: bigint;
  repertoire?: Repertoire | null;
}

export function initObjectEmploye(): Employe {
  return {
    id: BigInt(0),
    numEmp: 0,
    livrerNonLivrerDroit: 0,
    codeEmp: "",
    nom: "",
    prenom: "",
    login: "",
    motpass: "",
    email: "",
    typeUser: 0,
    etatCompte: false,
    validationMnt: 0,
    motPassFake: "",
    commercial: false,
    pvLibre: false,
    gerant: false,
    magasinier: false,
    bulltinPaie: false,
    imprimStockSimple: false,
    livraisonLimite: false,
    repertoireId: BigInt(0),
    repertoire: null,
  };
}