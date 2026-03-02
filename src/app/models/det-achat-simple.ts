import { Stock } from './stock';

export interface DetAchatSimple {
    id: bigint | null;
    stockId: bigint | null;
    stockDesignation: string;
    achatSimpleId: bigint | null;
    qte: number;
    prixAchat: number;
    remise: number;
    uniteGratuite: number;
    montant: number;
    achatSimpleMontant: number;
    achatSimpleDateOperation: Date | null;
}

export function initObjectDetAchatSimple(): DetAchatSimple {
    return {
        id: null,
        prixAchat: 0,
        qte: 0,
        remise: 0,
        uniteGratuite: 0,
        montant: 0,
        stockId: null,
        stockDesignation: '',
        achatSimpleId: null,
        achatSimpleMontant: 0,
        achatSimpleDateOperation: null
    };
}
