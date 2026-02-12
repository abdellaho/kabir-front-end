export interface PrintRequest {
    ids: bigint[];
    type: number;
    fournisseurId: bigint | null;
}

export function initObjectPrintRequest(): PrintRequest {
    return {
        ids: [],
        type: 0,
        fournisseurId: null
    };
}
