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
    dateFacture: Date | string;
    sysDate: Date | string;
    dateAvances1: Date | string;
    mantantAvancs1: number;
    dateAvances2: Date | string;
    mantantAvancs2: number;
    totalPaye: number;
    mntFacture: string;
    mntDouane: number;
    mntTransport: number;
    mntTransportIntern: number;
    mntTransit: number;
    mntMagasinage: number;
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
        numFacture: 0,
        dateFacture: new Date(),
        sysDate: new Date(),
        dateAvances1: new Date(),
        mantantAvancs1: 0,
        dateAvances2: new Date(),
        mantantAvancs2: 0,
        totalPaye: 0,
        mntFacture: '',
        mntDouane: 0,
        mntTransport: 0,
        mntTransportIntern: 0,
        mntTransit: 0,
        mntMagasinage: 0,
        prixAchatDetaille: 0,
        totalAllMnt: 0
    };
}
