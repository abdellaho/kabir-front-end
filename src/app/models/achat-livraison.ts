export interface AchatLivraison {
  id: bigint;
  codeAL: string;
  numAchat: number;
  dateAL: Date;
  sysDate: Date;
  prixNormalAchatHt: number;
  numeroBlExterne: string;
  mantantAL: number;
  mantantALTTC: number;
  mantantALTVA20: number;
  mantantALTVA7: number;
  totalMantantALTVA: number;
  mantantBFBenefice: number;
  montantTVA7: number;
  montantTVA10: number;
  montantTVA14: number;
  montantTVA20: number;
}

export function initObjectAchatLivraison(): AchatLivraison {
  return {
    id: BigInt(0),
    codeAL: "",
    numAchat: 0,
    dateAL: new Date(),
    sysDate: new Date(),
    prixNormalAchatHt: 0,
    numeroBlExterne: "",
    mantantAL: 0,
    mantantALTTC: 0,
    mantantALTVA20: 0,
    mantantALTVA7: 0,
    totalMantantALTVA: 0,
    mantantBFBenefice: 0,
    montantTVA7: 0,
    montantTVA10: 0,
    montantTVA14: 0,
    montantTVA20: 0,
  };
}