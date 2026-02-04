export interface DetBulletinLivraison {
    id: bigint | null;
    commission: number;
    commissionFixe: number;
    commsiondh: number;
    mantantcommission: number;
    benDH: number;
    rougenormal: boolean;
    bulletinPaiId: bigint | null;
    livraisonId: bigint | null;
    livraisonCodeBl: string;
    livraisonDateBl: Date | null;
    livraisonMantantBL: number;
    livraisonMantantBLReel: number;
    livraisonReglerNonRegler: number;
    livraisonRepertoireDesignation: string;
}

export function initObjectDetBulletinLivraison(): DetBulletinLivraison {
    return {
        id: null,
        commission: 0,
        commissionFixe: 0,
        commsiondh: 0,
        mantantcommission: 0,
        benDH: 0,
        rougenormal: false,
        bulletinPaiId: null,
        livraisonId: null,
        livraisonDateBl: null,
        livraisonCodeBl: '',
        livraisonMantantBL: 0,
        livraisonMantantBLReel: 0,
        livraisonReglerNonRegler: 0,
        livraisonRepertoireDesignation: ''
    };
}
