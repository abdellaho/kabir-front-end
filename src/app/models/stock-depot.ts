export interface StockDepot {
    id?: bigint | null;
    qteStockDepot: number;
    dateOperation: string | Date;
    dateSys: string | Date;
    stockId: bigint | null;
}

export function initObjectStockDepot(): StockDepot {
    return {
        id: null,
        qteStockDepot: 1,
        dateOperation: new Date(),
        dateSys: new Date(),
        stockId: null
    };
}
