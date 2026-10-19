/**
 * Request of the livraison "Consulter" etats (POST /livraison/imprimer/etat).
 * `type` mirrors the legacy `typeImpression`:
 * 0 = Consulter Commercial, 1 = Consulter Produit, 2 = Consulter Villes,
 * 3 = Consulter Client, 4 = Consulter Client + Regle / Non Regle,
 * 5 = Consulter (journalier commercial), 6 = Consulter Client + Produit.
 * `byBlOrProduit`: 0 = par BL, 1 = par Produit.
 * Dates must be sent as `yyyy-MM-dd` strings (backend `LocalDate`).
 */
export interface LivraisonPrintRequest {
    type: number;
    dateDebut: string | null;
    dateFin: string | null;
    repertoireId: number | null;
    personnelId: number | null;
    stockId: number | null;
    byBlOrProduit: number;
    /** Type 4 selector: 0 = Non Regle, 1 = Regle, 2/unset = aucun. */
    reglerNonRegler: number | null;
    /** Type 2 ville selector (0 = Tous Les Villes). */
    villeId: number | null;
    /** Type 6 client selector (0 = none selected). */
    repertoireClientId2: number | null;
}

export function initObjectLivraisonPrintRequest(): LivraisonPrintRequest {
    return {
        type: 0,
        dateDebut: null,
        dateFin: null,
        repertoireId: null,
        personnelId: null,
        stockId: null,
        byBlOrProduit: 0,
        reglerNonRegler: null,
        villeId: null,
        repertoireClientId2: null
    };
}
