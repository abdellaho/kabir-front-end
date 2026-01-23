import { Stock } from './stock';

export interface DetAchatEtranger {
    id: bigint | null;
    stockId: bigint | null;
    stockDesignation: string;
    stockTva: number;
    stockPattc: number;
    stockPvttc: number;
    stockQteStock: number;
    stockQteFacturer: number;
    achatEtrangerId: bigint | null;
    qteAchat: number;
    qteStock: number;
    prixAchat: number;
    stock?: Stock | null;
}

export function initObjectDetAchatEtranger(): DetAchatEtranger {
    return {
        id: null,
        achatEtrangerId: null,
        stockId: null,
        stockDesignation: '',
        stockTva: 0,
        stockPattc: 0,
        stockPvttc: 0,
        stockQteStock: 0,
        stockQteFacturer: 0,
        qteAchat: 0,
        qteStock: 0,
        prixAchat: 0
    };
}
