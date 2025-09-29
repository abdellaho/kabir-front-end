import { Repertoire } from "./Repertoire";

export interface Compta {
  id: bigint;
  dateDebut: Date;
  dateFin: Date;
  montantTVAPrecedent: number;
  montantTVAAchat: number;
  montantTVAVente: number;
  resutMnt: number;
  repertoireId: bigint;
  repertoire?: Repertoire | null;
}

export function initObjectCompta(): Compta {
  return {
    id: BigInt(0),
    dateDebut: new Date(),
    dateFin: new Date(),
    montantTVAPrecedent: 0,
    montantTVAAchat: 0,
    montantTVAVente: 0,
    resutMnt: 0,
    repertoireId: BigInt(0),
    repertoire: null,
  };
}