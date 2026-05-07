export interface Role {
    canAdd: boolean;
    canDelete: boolean;
    canModify: boolean;
    isAdmin: boolean;
    isGerant: boolean;
    isComptable: boolean;
    isMagasinier: boolean;
    isCommercialInterne: boolean;
    isCommercialExterne: boolean;
}

export const initRole = (): Role => {
    return {
        canAdd: false,
        canDelete: false,
        canModify: false,
        isAdmin: false,
        isGerant: false,
        isComptable: false,
        isMagasinier: false,
        isCommercialInterne: false,
        isCommercialExterne: false
    };
};
