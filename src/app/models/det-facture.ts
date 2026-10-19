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
    stockDesignation: string;
    stockPvttc: number;
    stockQteFacturer: number;
    stockBenifice: number;
    stockTva: number;
    stock?: Stock | null;
    factureRepertoireDesignation: string;
    factureRepertoireTel1: string;
    factureRepertoireAdresse: string;
    factureRepertoireIce: string;
    factureRepertoireIfe: string;
    factureTypePaiement: string;
    factureMantantBFHT: number;
    factureTva7Total: number;
    factureTva20Total: number;
    factureFacturer100: boolean;
    factureDateReglement: Date | null;
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
        stockDesignation: '',
        stockPvttc: 0,
        stockQteFacturer: 0,
        stockBenifice: 0,
        stockTva: 0,
        factureRepertoireDesignation: '',
        factureRepertoireTel1: '',
        factureRepertoireAdresse: '',
        factureRepertoireIce: '',
        factureRepertoireIfe: '',
        factureTypePaiement: '',
        factureMantantBFHT: 0,
        factureTva7Total: 0,
        factureTva20Total: 0,
        factureFacturer100: false,
        factureDateReglement: null,
        stock: null
    };
}
