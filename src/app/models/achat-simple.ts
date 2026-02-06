export interface AchatSimple {
    id: bigint | null;
    numBlExterne: string;
    montant: number;
    dateOperation: Date;
    dateSys: Date;
    fournisseurId: bigint | null;
    fournisseurDesignation: string;
}

export function initObjectAchatSimple(): AchatSimple {
    return {
        id: null,
        numBlExterne: '',
        montant: 0,
        dateOperation: new Date(),
        dateSys: new Date(),
        fournisseurId: null,
        fournisseurDesignation: ''
    };
}
