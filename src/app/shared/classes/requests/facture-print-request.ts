/**
 * Request of the facture "Consulter" etats (POST /facture/imprimer/etat).
 * `type` mirrors the legacy `typeImpression` of `FactureActionBeans.viderImprimer`:
 * 0 = Consulter Chèque, 1 = Consulter TV détaillé, 2 = Consulter Bilan,
 * 3 = Consulter Produit, 4 = Consulter Client.
 * `stockId` is only used for type 3 (0 = all products) and
 * `repertoireId` only for type 4 (0 = all clients).
 * Dates must be sent as `yyyy-MM-dd` strings (backend `LocalDate`).
 */
export interface FacturePrintRequest {
    type: number;
    dateDebut: string | null;
    dateFin: string | null;
    stockId: number | null;
    repertoireId: number | null;
}

export function initObjectFacturePrintRequest(): FacturePrintRequest {
    return {
        type: 0,
        dateDebut: null,
        dateFin: null,
        stockId: null,
        repertoireId: null
    };
}
