export enum TypeRepertoire {
    NONE = 0,
    PHARMACIE = 1,
    REVENDEUR = 2,
    TRANSPORT = 3
}

export const filteredTypeRepertoire = [
    { label: '', value: TypeRepertoire.NONE },
    { label: 'Pharmacie', value: TypeRepertoire.PHARMACIE },
    { label: 'Revendeur', value: TypeRepertoire.REVENDEUR },
    { label: 'Transport', value: TypeRepertoire.TRANSPORT }
];

export enum TypeImprimerRepertoire {
    BON_LIVRAISON = 0,
    BL_EGALE_ZERO = 1,
    BL_EGALE_UN = 2,
    BL_SUPERIEUR_UN = 3,
    BL_SUPERIEUR_SIX_MONTH = 5,
    BL_INFERIEUR_SIX_MONTH = 6,
    BL_INFERIEUR_ONE_YEAR = 4,
    BL_SUPERIEUR_ONE_YEAR = 7,
    LIB_TEL_EGALE_1 = 8,
    LIB_TEL_SUPERIEUR_1 = 9,
    CLIENT_PLUS_ADRESSE = 10
}

export const typeImprimerRepertoirePharmacie = [
    { label: 'Bon de Livraison', value: TypeImprimerRepertoire.BON_LIVRAISON },
    { label: 'BL = 0', value: TypeImprimerRepertoire.BL_EGALE_ZERO },
    { label: 'BL = 1', value: TypeImprimerRepertoire.BL_EGALE_UN },
    { label: 'BL > 1', value: TypeImprimerRepertoire.BL_SUPERIEUR_UN },
    { label: 'BL > 6 mois', value: TypeImprimerRepertoire.BL_SUPERIEUR_SIX_MONTH },
    { label: 'BL < 6 mois', value: TypeImprimerRepertoire.BL_INFERIEUR_SIX_MONTH },
    { label: 'BL < 1 année', value: TypeImprimerRepertoire.BL_INFERIEUR_ONE_YEAR },
    { label: 'BL > 1 année', value: TypeImprimerRepertoire.BL_SUPERIEUR_ONE_YEAR },
    { label: 'Tel = 1', value: TypeImprimerRepertoire.LIB_TEL_EGALE_1 },
    { label: 'Tel > 1', value: TypeImprimerRepertoire.LIB_TEL_SUPERIEUR_1 }
];

export const typeImprimerRepertoireRevendeur = [
    { label: 'Bon de Livraison', value: TypeImprimerRepertoire.BON_LIVRAISON },
    { label: 'BL = 0', value: TypeImprimerRepertoire.BL_EGALE_ZERO },
    { label: 'BL = 1', value: TypeImprimerRepertoire.BL_EGALE_UN },
    { label: 'BL > 1', value: TypeImprimerRepertoire.BL_SUPERIEUR_UN },
    { label: 'Client + Adresse', value: TypeImprimerRepertoire.CLIENT_PLUS_ADRESSE }
];
