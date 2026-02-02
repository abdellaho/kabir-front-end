export interface BulletinPaiRequest {
    dateDebut: Date;
    dateFin: Date;
    commercialId: bigint | null;
    sansMontant: boolean;
    livraisonId: bigint | null;
}

export function initBulletinPaiRequest(): BulletinPaiRequest {
    return {
        dateDebut: new Date(),
        dateFin: new Date(),
        commercialId: null,
        sansMontant: false,
        livraisonId: null
    };
}
