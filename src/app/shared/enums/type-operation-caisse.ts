export enum TypeOperationCaisse {
    VERSEMENT = 0,
    RETRAIT = 1
}

export const filteredTypeOperationCaisse = [
    { label: 'Versement', value: TypeOperationCaisse.VERSEMENT },
    { label: 'Retrait', value: TypeOperationCaisse.RETRAIT }
];
