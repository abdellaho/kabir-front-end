export interface CommonSearchModel {
    searchByDate: boolean;
    dateDebut: Date | null;
    dateFin: Date | null;
    fournisseurId: bigint | null;
    repertoireId: bigint | null;
    personnelId: bigint | null;
    operateurId: bigint | null;
    absence: boolean;
    matin: boolean;
    apresMidi: boolean;
    etatcheque: number;
    compteCaisse: boolean;
    numCheque: string;
    numRemise: string;
}

export function initCommonSearchModel(): CommonSearchModel {
    return {
        searchByDate: false,
        dateDebut: null,
        dateFin: null,
        fournisseurId: null,
        repertoireId: null,
        personnelId: null,
        operateurId: null,
        absence: false,
        matin: false,
        apresMidi: false,
        etatcheque: 0,
        compteCaisse: false,
        numCheque: '',
        numRemise: ''
    };
}
