export enum TypeFourniseur {
    MARCHANDISES = 0,
    SERVICES = 1,
    DOUANES = 2,
    CARBURANT = 3,
    FOURNITURE = 4,
}

export const filteredTypeFourniseur = [
    { label: 'Marchandises', value: TypeFourniseur.MARCHANDISES },
    { label: 'Services', value: TypeFourniseur.SERVICES },
    { label: 'Douanes', value: TypeFourniseur.DOUANES },
    { label: 'Carburant', value: TypeFourniseur.CARBURANT },
    { label: 'Fourniture', value: TypeFourniseur.FOURNITURE },
];