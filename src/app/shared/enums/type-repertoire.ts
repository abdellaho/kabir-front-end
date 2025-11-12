export enum TypeRepertoire {
    NONE = 0,
    PHARMACIE = 1,
    REVENDEUR = 2,
    TRANSPORT = 3,
}

export const filteredTypeRepertoire = [
    { label: '', value: TypeRepertoire.NONE },
    { label: 'Pharmacie', value: TypeRepertoire.PHARMACIE },
    { label: 'Revendeur', value: TypeRepertoire.REVENDEUR },
    { label: 'Transport', value: TypeRepertoire.TRANSPORT },
];