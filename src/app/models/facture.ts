export interface Facture {
  id: bigint;
  numFacture: number;
  codeBF: string;
  dateBF: Date;
  dateReglement: Date;
  dateReglement2: Date | null;
  dateReglement3: Date | null;
  dateReglement4: Date | null;
  typeReglment: number;
  typeReglment2: number;
  typeReglment3: number;
  typeReglment4: number;
  typePaiement: string;
  mantantBF: number;
  mantantBFBenefice: number;
  tva7Total: number;
  tva20Total: number;
  sysDate: Date;
  mantantBFHT: number;
  numeroLibil: string;
  mntHT2O: number;
  mntHT7: number;
  tva7: number;
  tva20: number;
  numCheque: string;
  numCheque2: string;
  numCheque3: string;
  numCheque4: string;
  numRemise: string;
  numRemise2: string;
  numRemise3: string;
  numRemise4: string;
  mntReglement: number;
  mntReglement2: number;
  mntReglement3: number;
  mntReglement4: number;
  type: number;
  facturer100: boolean;
  calculer: boolean;
  disableMontant: boolean;
  typeTVA: string;
  dateReglementIn?: boolean | null;
  dateReglement2In?: boolean | null;
  dateReglement3In?: boolean | null;
  dateReglement4In?: boolean | null;
  tva20Reglement1: number;
  tva20Reglement2: number;
  tva20Reglement3: number;
  tva20Reglement4: number;
  mntHT20Reglement1: number;
  mntHT20Reglement2: number;
  repertoireId: bigint | null;
  personnelId: bigint | null;
}

export function initObjectFacture(): Facture {
  return {
    id: BigInt(0),
    numFacture: 0,
    codeBF: "",
    dateBF: new Date(),
    dateReglement: new Date(),
    dateReglement2: null,
    dateReglement3: null,
    dateReglement4: null,
    typeReglment: 0,
    typeReglment2: 0,
    typeReglment3: 0,
    typeReglment4: 0,
    typePaiement: "",
    mantantBF: 0,
    mantantBFBenefice: 0,
    tva7Total: 0,
    tva20Total: 0,
    sysDate: new Date(),
    mantantBFHT: 0,
    numeroLibil: "",
    mntHT2O: 0,
    mntHT7: 0,
    tva7: 0,
    tva20: 0,
    numCheque: "",
    numCheque2: "",
    numCheque3: "",
    numCheque4: "",
    numRemise: "",
    numRemise2: "",
    numRemise3: "",
    numRemise4: "",
    mntReglement: 0,
    mntReglement2: 0,
    mntReglement3: 0,
    mntReglement4: 0,
    type: 0,
    facturer100: false,
    calculer: false,
    disableMontant: false,
    typeTVA: "",
    dateReglementIn: false,
    dateReglement2In: false,
    dateReglement3In: false,
    dateReglement4In: false,
    tva20Reglement1: 0,
    tva20Reglement2: 0,
    tva20Reglement3: 0,
    tva20Reglement4: 0,
    mntHT20Reglement1: 0,
    mntHT20Reglement2: 0,
    repertoireId: null,
    personnelId: null,
  };
}