export interface Caisse {
    id: bigint | null;
    montant: number;
    dateOperation: Date;
    type: number;
}

export function initObjectCaisse(): Caisse {
    return {
        id: null,
        montant: 0,
        dateOperation: new Date(),
        type: 0
    };
}
