export interface Entretien {
    id: bigint | null ;
    voitureId: bigint | null;
    voitureNumVoiture: string;
    voitureKmMax: number;
    dateEntretien: Date;
    dateSys: Date;
    kmDetecte: number;
    kmMax: number;
    huile: boolean;
    filtreHuile: boolean;
    filtreCarburant: boolean;
    filtreAir: boolean;
    plaquetteAV: boolean;
    plaquetteAR: boolean;
    pneuAV: boolean;
    pneuAR: boolean;
    kitDistribution: boolean;
    batterie: boolean;
}

export function initObjectEntretien(): Entretien {
    return {
        id: null,
        voitureId: null,
        voitureNumVoiture: '',
        voitureKmMax: 0,
        dateEntretien: new Date(),
        dateSys: new Date(),
        kmDetecte: 0,
        kmMax: 0,
        huile: false,
        filtreHuile: false,
        filtreCarburant: false,
        filtreAir: false,
        plaquetteAV: false,
        plaquetteAR: false,
        pneuAV: false,
        pneuAR: false,
        kitDistribution: false,
        batterie: false,
    };
}