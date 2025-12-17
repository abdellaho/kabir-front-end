export enum TypeReglement {
    ESPECE = 0,
    CHEQUE = 1,
    TRAITE = 2,
    VIREMENT = 3,
}

export const filteredTypeReglement = [
    { label: 'Espéce', value: TypeReglement.ESPECE },
    { label: 'Cheque', value: TypeReglement.CHEQUE },
    { label: 'Traite', value: TypeReglement.TRAITE },
    { label: 'Virement', value: TypeReglement.VIREMENT },
];