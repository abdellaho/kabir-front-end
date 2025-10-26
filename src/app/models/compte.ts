export interface Compte {
    id: bigint | null;
    designation: string;
    password: string;
}

export function initObjectCompte(): Compte {
    return {
        id: null,
        designation: '',
        password: ''
    }
}