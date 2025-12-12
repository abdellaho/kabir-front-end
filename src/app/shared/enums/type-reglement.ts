export enum TypeReglement {
    ESPECE = 0,
    CHEQUE = 1,
    VIREMENT = 2,
    CREDIT = 3,
}

export const filteredTypeReglement = [
    { label: 'Espéce', value: TypeReglement.ESPECE },
    { label: 'Cheque', value: TypeReglement.CHEQUE },
    { label: 'Virement', value: TypeReglement.VIREMENT },
    { label: 'Credit', value: TypeReglement.CREDIT },
];