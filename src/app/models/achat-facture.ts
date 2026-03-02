export interface AchatFacture {
    id: bigint | null;
    codeAF: string;
    numAchat: number;
    dateAF: Date | string;
    sysDate: Date | string;
    numeroFacExterne: string;
    numeroIF: string;
    dateReglement: Date | string;
    typeReglment: number;
    typePaiement: string;
    numCheque: string;
    tva7: number;
    tva20: number;
    mntTtc: number;
    mantantAF: number;
    totalMntProduit: number;
    mantantTotHT: number;
    mantantTotHTVA: number;
    mantantTotTTC: number;
    fournisseurId: bigint | null;
    fournisseurDesignation: string;
    fournisseurIce: string;
}

export function initObjectAchatFacture(): AchatFacture {
    return {
        id: null,
        codeAF: '',
        numAchat: 0,
        dateAF: new Date(),
        sysDate: new Date(),
        numeroFacExterne: '',
        numeroIF: '',
        dateReglement: new Date(),
        typeReglment: 0,
        typePaiement: '',
        numCheque: '',
        tva7: 0,
        tva20: 0,
        mntTtc: 0,
        mantantAF: 0,
        totalMntProduit: 0,
        mantantTotHT: 0,
        mantantTotHTVA: 0,
        mantantTotTTC: 0,
        fournisseurId: null,
        fournisseurDesignation: '',
        fournisseurIce: ''
    };
}
