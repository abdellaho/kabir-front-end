export interface StockDepot { 
    id?: bigint | null;
    dateOperation: string | Date;
    dateSys: string | Date;
}

export function initObjectStockDepot(): StockDepot {
    return {
        id: null,
        dateOperation: new Date(),
        dateSys: new Date(),
    };
}
