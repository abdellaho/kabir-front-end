export enum TypePersonnel {
    NONE = 0,
    ADMINISTRATEUR = 1,
    GERANT = 2,
    COMPATBLE = 3,
    MAGASINIER = 4,
    COMMERCIAL_INTERNE = 5,
    COMMERCIAL_EXTERNE = 6
}

export const filteredTypePersonnel = [
    { label: 'Administrateur', value: TypePersonnel.ADMINISTRATEUR },
    { label: 'Gérant', value: TypePersonnel.GERANT },
    { label: 'Comptable', value: TypePersonnel.COMPATBLE },
    { label: 'Magasinier', value: TypePersonnel.MAGASINIER },
    { label: 'Commercial Interne', value: TypePersonnel.COMMERCIAL_INTERNE },
    { label: 'Commercial Externe', value: TypePersonnel.COMMERCIAL_EXTERNE }
];

export const filteredTypePersonnelAll = [
    { label: '', value: TypePersonnel.NONE },
    { label: 'Administrateur', value: TypePersonnel.ADMINISTRATEUR },
    { label: 'Gérant', value: TypePersonnel.GERANT },
    { label: 'Comptable', value: TypePersonnel.COMPATBLE },
    { label: 'Magasinier', value: TypePersonnel.MAGASINIER },
    { label: 'Commercial Interne', value: TypePersonnel.COMMERCIAL_INTERNE },
    { label: 'Commercial Externe', value: TypePersonnel.COMMERCIAL_EXTERNE }
];