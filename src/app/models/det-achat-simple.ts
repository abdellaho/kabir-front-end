import { Stock } from './stock';

export interface DetAchatSimple {
    id: bigint | null;
    stockId: bigint | null;
    stockDesignation: string;
    achatSimpleId: bigint | null;
    qte: number;
    prixAchat: number;
    remiseAchat: number;
    remise: number;
    uniteGratuite: number;
    montant: number;
}

export function initObjectDetAchatSimple(): DetAchatSimple {
    return {
        id: null,
        prixAchat: 0,
        remiseAchat: 0,
        qte: 0,
        remise: 0,
        uniteGratuite: 0,
        montant: 0,
        stockId: null,
        stockDesignation: '',
        achatSimpleId: null
    };
}
