import { Facture } from './facture';
import { Stock } from './stock';

export interface DetFacture {
    id: bigint | null;
    qteFacturer: number;
    remiseFacture: number;
    prixVente: number;
    montantProduit: number;
    beneficeDH: number;
    benepourcentage: number;
    tva7: number;
    tva20: number;
    montantProduitHT: number;
    directFacture: number;
    avecRemise: boolean;
    factureId: bigint | null;
    facture?: Facture | null;
    stockId: bigint | null;
    stock?: Stock | null;
}

export function initObjectDetFacture(): DetFacture {
    return {
        id: null,
        qteFacturer: 0,
        remiseFacture: 0,
        prixVente: 0,
        montantProduit: 0,
        beneficeDH: 0,
        benepourcentage: 0,
        tva7: 0,
        tva20: 0,
        montantProduitHT: 0,
        directFacture: 0,
        avecRemise: false,
        factureId: null,
        facture: null,
        stockId: null,
        stock: null
    };
}
