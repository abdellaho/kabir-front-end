import { Stock } from "./stock";

export interface DetStockDepot {
    id?: bigint | null;
    qte: number;
    stockId: bigint | null;
    stockDesignation: string;
    stock?: Stock | null;
}

export function initObjectDetStockDepot(): DetStockDepot {
    return {
        id: null,
        qte: 1,
        stockId: null,
        stockDesignation: "",
        stock: null
    };
}
