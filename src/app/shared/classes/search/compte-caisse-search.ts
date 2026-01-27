export interface CompteCaisseSearch {
    compteCaisse: boolean;
    searchByDate: boolean;
    dateDebutSearch: Date | null;
    dateFinSearch: Date | null;
}

export function initObjectCompteCourantSearch(): CompteCaisseSearch {
    return {
        compteCaisse: false,
        searchByDate: false,
        dateDebutSearch: null,
        dateFinSearch: null
    };
}

export function initObjectCaisseGeneraleSearch(): CompteCaisseSearch {
    return {
        compteCaisse: true,
        searchByDate: false,
        dateDebutSearch: null,
        dateFinSearch: null
    };
}
