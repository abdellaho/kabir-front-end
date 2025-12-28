import { Stock } from "./stock";

export interface DetAchatSimple {
    id: bigint | null;
    qte: number;
    prixVente: number;
    remise: number;
    uniteGratuite: number;
    montant: number;
    stockDesignation: string;
    stockId: bigint | null;
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
        stockDesignation: '',
        stockId: null,
        achatSimpleId: null,
        stock: null
    };
}
