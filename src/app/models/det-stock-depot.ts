import { Stock } from './stock';

export interface DetStockDepot {
    id?: bigint | null;
    qte: number;
    stockDepotId: bigint | null;
    stockDateOperation: Date | null;
    stockId: bigint | null;
    stockDesignation: string;
    stockQteStock: number;
    stockPvttc: number;
    stockPattc: number;
    stock?: Stock | null;
}

export function initObjectDetStockDepot(): DetStockDepot {
    return {
        id: null,
        qte: 1,
        stockDepotId: null,
        stockDateOperation: null,
        stockId: null,
        stockDesignation: '',
        stockQteStock: 0,
        stockPvttc: 0,
        stockPattc: 0,
        stock: null
    };
}
