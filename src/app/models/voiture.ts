export interface Voiture {
    id: bigint | null;
    numVoiture: string;
    kmMax: number;
}

export function initObjectVoiture(): Voiture {
    return {
        id: null,
        numVoiture: '',
        kmMax: 0
    }
}