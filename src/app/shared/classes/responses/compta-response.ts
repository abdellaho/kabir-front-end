export interface ComptaResponse {
    tva7Sum: number;
    tva20Sum: number;
    achatTvaSum: number;
}

export function initObjectComptaResponse(): ComptaResponse {
    return {
        tva7Sum: 0,
        tva20Sum: 0,
        achatTvaSum: 0
    };
}
