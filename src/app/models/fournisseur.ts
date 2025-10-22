import { Ville } from "./ville";

export interface Fournisseur {
    id: bigint | null;
    designation: string;
    type: number;
    tel1: string;
    tel2: string;
    ice: string;
    ville: Ville | null;
    villeId: bigint | null;
}

export function initObjectFournisseur(): Fournisseur {
    return {
        id: null,
        designation: '',
        type: 0,
        tel1: '',
        tel2: '',
        ice: '',
        ville: null,
        villeId: null,
    }
}