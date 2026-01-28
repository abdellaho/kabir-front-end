export interface ComptaSearch {
    id: bigint | null;
    searchByDate: boolean;
    dateDebut: Date | null;
    dateFin: Date | null;
    montantTVAPrecedent: number;
    montantTVAAchat: number;
    montantTVAVente: number;
    resutMnt: number;
    repertoireId: bigint | null;
}

export function initComptaSearch(): ComptaSearch {
    return {
        id: null,
        searchByDate: false,
        dateDebut: null,
        dateFin: null,
        montantTVAPrecedent: 0,
        montantTVAAchat: 0,
        montantTVAVente: 0,
        resutMnt: 0,
        repertoireId: null
    };
}
