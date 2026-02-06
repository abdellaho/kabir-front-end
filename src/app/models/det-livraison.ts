import { Livraison } from './livraison';
import { Stock } from './stock';

export interface DetLivraison {
    id: bigint | null;
    qteLivrer: number;
    champsRouge: number;
    remiseLivraison: number;
    prixVente: number;
    montantProduit: number;
    beneficeDH: number;
    benepourcentage: number;
    infinity: number;
    avecRemise: boolean;
    livraisonId: bigint | null;
    livraison?: Livraison | null;
    stockId: bigint | null;
    stockDesignation: string;
    stockQteStock: number;
    stockPvttc: number;
    stockPattc: number;
    stock?: Stock | null;
}

export function initObjectDetLivraison(): DetLivraison {
    return {
        id: null,
        qteLivrer: 0,
        champsRouge: 0,
        remiseLivraison: 0,
        prixVente: 0,
        montantProduit: 0,
        beneficeDH: 0,
        benepourcentage: 0,
        infinity: 0,
        avecRemise: false,
        livraisonId: null,
        livraison: null,
        stockId: null,
        stockDesignation: '',
        stockQteStock: 0,
        stockPvttc: 0,
        stockPattc: 0,
        stock: null
    };
}
