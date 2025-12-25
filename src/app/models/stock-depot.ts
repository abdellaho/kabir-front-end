export interface StockDepot { 
    id?: bigint | null;
    dateOperation: string | Date;
    dateSys: string | Date;
    numBlExterne: string;
    montantTTC: number;
}

export function initObjectStockDepot(): StockDepot {
    return {
        id: null,
        dateOperation: new Date(),
        dateSys: new Date(),
        numBlExterne: "",
        montantTTC: 0
    };
}
