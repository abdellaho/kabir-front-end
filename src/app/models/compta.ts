export interface Compta {
    id: bigint | null;
    dateDebut: Date;
    dateFin: Date;
    montantTVAPrecedent: number;
    montantTVAAchat: number;
    montantTVAVente: number;
    resutMnt: number;
}

export function initObjectCompta(): Compta {
    return {
        id: null,
        dateDebut: new Date(),
        dateFin: new Date(),
        montantTVAPrecedent: 0,
        montantTVAAchat: 0,
        montantTVAVente: 0,
        resutMnt: 0
    };
}
