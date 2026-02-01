export interface BulletinPai {
  id: bigint | null;
    codeBulletin: string;
    observation: string;
    numBulletin: number;
    dateOperation: Date;
    dateDebut: Date;
    dateFin: Date;
    typeBulletinPai: number;
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
    commercialId: bigint | null;
    commercialDesignation: string;
    commercialCin: string;
    commercialTel1: string;
    commercialTel2: string;
    operateurId: bigint | null;
    operateurDesignation: string;
}

export function initObjectBulletinPai(): BulletinPai {
  return {
    id: null,
    codeBulletin: "",
    observation: "",
    numBulletin: 0,
    dateOperation: new Date(),
    dateDebut: new Date(),
    dateFin: new Date(),
    typeBulletinPai: 0,
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
    commercialId: null,
    commercialDesignation: "",
    commercialCin: "",
    commercialTel1: "",
    commercialTel2: "",
    operateurId: null,
    operateurDesignation: "",
  };
}