export interface DetAchatFactureTVA {
    id: bigint | null;
    taux: number;
    mntHT: number;
    mntTVA: number;
    mntTTC: number;
    achatFactureId: bigint | null;
}

export function initObjectDetAchatFactureTVA(): DetAchatFactureTVA {
    return {
        id: null,
        taux: 0,
        mntHT: 0,
        mntTVA: 0,
        mntTTC: 0,
        achatFactureId: null
    };
}