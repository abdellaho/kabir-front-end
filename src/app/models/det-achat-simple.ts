import { Stock } from './stock';

export interface DetAchatSimple {
    id: bigint | null;
    qte: number;
    prixVente: number;
    remise: number;
    uniteGratuite: number;
    montant: number;
    stockId: bigint | null;
    stockDesignation: string;
    stockPvttc: number;
    stockQteStock: number;
    achatSimpleId: bigint | null;
    stock?: Stock | null;
}

export function initObjectDetAchatSimple(): DetAchatSimple {
    return {
        id: null,
        qte: 0,
        prixVente: 0,
        remise: 0,
        uniteGratuite: 0,
        montant: 0,
        stockId: null,
        stockDesignation: '',
        stockPvttc: 0,
        stockQteStock: 0,
        achatSimpleId: null,
        stock: null
    };
}
