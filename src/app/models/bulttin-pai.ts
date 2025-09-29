import { Employe } from "./employe";
import { Repertoire } from "./Repertoire";

export interface BulttinPai {
  id: bigint;
  codeBultin: string;
  observation: string;
  numbultin: number;
  dateOperation: Date;
  dateDebut: Date;
  dateFin: Date;
  idTypeBultinPai: number;
  salairefx: number;
  commission: number;
  frais: number;
  total: number;
  totalMntVendue: number;
  totalMntVendueProduit: number;
  totalMntVendueLivraison: number;
  mntNegative: number;
  mntNegativeProduit: number;
  mntNegativeLivraison: number;
  mntCNSS: number;
  mntPenalite: number;
  mntBenefice: number;
  commissionParProduit: number;
  primeSpecial: number;
  fraisSupp: number;
  primeCommercial: number;
  externe: boolean;
  totalMntVenduePrixCommercial: number;
  totalMntVendueSansPrixCommercial: number;
  primeProduit: number;
  commercailId: bigint;
  commercail?: Repertoire | null;
  employeOperateurId: bigint;
  employeOperateur?: Employe | null;
}

export function initObjectBulttinPai(): BulttinPai {
  return {
    id: BigInt(0),
    codeBultin: "",
    observation: "",
    numbultin: 0,
    dateOperation: new Date(),
    dateDebut: new Date(),
    dateFin: new Date(),
    idTypeBultinPai: 0,
    salairefx: 0,
    commission: 0,
    frais: 0,
    total: 0,
    totalMntVendue: 0,
    totalMntVendueProduit: 0,
    totalMntVendueLivraison: 0,
    mntNegative: 0,
    mntNegativeProduit: 0,
    mntNegativeLivraison: 0,
    mntCNSS: 0,
    mntPenalite: 0,
    mntBenefice: 0,
    commissionParProduit: 0,
    primeSpecial: 0,
    fraisSupp: 0,
    primeCommercial: 0,
    externe: false,
    totalMntVenduePrixCommercial: 0,
    totalMntVendueSansPrixCommercial: 0,
    primeProduit: 0,
    commercailId: BigInt(0),
    commercail: null,
    employeOperateurId: BigInt(0),
    employeOperateur: null,
  };
}