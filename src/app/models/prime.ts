export interface Prime {
    id: bigint | null;
    montant: number;
    prime: number;
}

export function initObjectPrime(): Prime {
    return {
        id: null,
        montant: 0,
        prime: 0
    };
}