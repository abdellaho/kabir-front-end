export interface DetStockDepot {
    id?: bigint | null;
    qte: number;
    prixVente: number;
    uniteGratuit: number;
    remise: number;
    stockId: bigint | null;
    stockDesignation: string;
}

export function initObjectDetStockDepot(): DetStockDepot {
    return {
        id: null,
        qte: 1,
        prixVente: 0,
        uniteGratuit: 0,
        remise: 0,
        stockId: null,
        stockDesignation: ""
    };
}
