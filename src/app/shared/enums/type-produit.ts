export enum TypeProduit {
    NONE = 0,
    INTERNE = 1,
    EXTERNE = 2
}

export const filteredTypeProduit = [
    { label: 'Type Produit', value: TypeProduit.NONE },
    { label: 'Interne', value: TypeProduit.INTERNE },
    { label: 'Externe', value: TypeProduit.EXTERNE },
];