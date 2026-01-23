export interface AchatEtranger {
    id: bigint | null;
    fournisseurId: bigint | null;
    fournisseurDesignation: string;
    fournisseurTel1: string;
    fournisseurTel2: string;
    fournisseurIce: string;
    fournisseurAdresse: string | null;
    operateurId: bigint | null;
    codeFacture: string | null;
    numFacture: number | null;
    dateFacture: Date | null;
    sysDate: Date | null;
    dateAvances1: Date;
    mantantAvancs1: number;
    dateAvances2: Date;
    mantantAvancs2: number;
    totalPaye: number;
    mntFacture: number;
    mntDouane: number;
    mntTransport: number;
    mntTransportIntern: number;
    mntTransit: number;
    mntMagazinage: number;
    prixAchatDetaille: number;
    totalAllMnt: number;
}

export function initObjectAchatEtranger(): AchatEtranger {
    return {
        id: null,
        fournisseurId: null,
        fournisseurDesignation: '',
        fournisseurTel1: '',
        fournisseurTel2: '',
        fournisseurIce: '',
        fournisseurAdresse: '',
        operateurId: null,
        codeFacture: '',
        numFacture: null,
        dateFacture: new Date(),
        sysDate: new Date(),
        dateAvances1: new Date(),
        mantantAvancs1: 0,
        dateAvances2: new Date(),
        mantantAvancs2: 0,
        totalPaye: 0,
        mntFacture: 0,
        mntDouane: 0,
        mntTransport: 0,
        mntTransportIntern: 0,
        mntTransit: 0,
        mntMagazinage: 0,
        prixAchatDetaille: 0,
        totalAllMnt: 0
    };
}
