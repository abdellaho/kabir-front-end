export interface DetStockDepot {
    id?: bigint | null;
    qte: number;
    stockId: bigint | null;
    stockDesignation: string;
}

export function initObjectDetStockDepot(): DetStockDepot {
    return {
        id: null,
        qte: 1,
        stockId: null,
        stockDesignation: ""
    };
}
