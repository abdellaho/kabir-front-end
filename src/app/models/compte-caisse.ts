export interface CompteCaisse {
    id: bigint | null;
    date: Date;
    designation: string;
    numFacture: string;
    montant: number;
    compteCaisse: boolean;
}

export function initObjectCompteCourant(): CompteCaisse {
    return {
        id: null,
        date: new Date(),
        designation: '',
        numFacture: '',
        montant: 0,
        compteCaisse: false
    };
}

export function initObjectCaisseGenerale(): CompteCaisse {
    return {
        id: null,
        date: new Date(),
        designation: '',
        numFacture: '',
        montant: 0,
        compteCaisse: true
    };
}
