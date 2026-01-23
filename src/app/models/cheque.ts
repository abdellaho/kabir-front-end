export interface Cheque {
    id: bigint | null;
    numero: string;
    codeCheque: string;
    dateCheque: Date;
    montant: number;
    typePersoScte: number;
    numCheque: number;
    etatcheque: boolean;
    typeReglment: number;
    fournisseurId: bigint | null;
    fournisseurDesignation: string;
    fournisseurTel1: string;
    fournisseurTel2: string;
    fournisseurAdresse: string;
    fournisseurIce: string;
    operateurId: bigint | null;
}

export function initObjectCheque(): Cheque {
    return {
        id: null,
        numero: '',
        codeCheque: '',
        dateCheque: new Date(),
        montant: 0,
        typePersoScte: 1,
        numCheque: 0,
        etatcheque: false,
        typeReglment: 0,
        fournisseurId: null,
        fournisseurDesignation: '',
        fournisseurTel1: '',
        fournisseurTel2: '',
        fournisseurAdresse: '',
        fournisseurIce: '',
        operateurId: null
    };
}
