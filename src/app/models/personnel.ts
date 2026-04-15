export interface Personnel {
    id: bigint | null;
    designation: string;
    cin: string;
    login: string;
    password: string;
    passwordFake: string;
    typePersonnel: number;
    etatComptePersonnel: boolean;
    tel1: string;
    tel2: string;
    adresse: string;
    email: string;
    dateEntrer: Date;
    dateSuppression: Date | null;
    salaire: number;
    canDelete: boolean;
    archiver: boolean;
    supprimer: boolean;
    consulterStock: boolean;
    ajouterStock: boolean;
    modifierStock: boolean;
    supprimerStock: boolean;
    consulterRepertoire: boolean;
    ajouterRepertoire: boolean;
    modifierRepertoire: boolean;
    supprimerRepertoire: boolean;
    consulterTransport: boolean;
    ajouterTransport: boolean;
    modifierTransport: boolean;
    supprimerTransport: boolean;
    consulterLivraison: boolean;
    ajouterLivraison: boolean;
    modifierLivraison: boolean;
    supprimerLivraison: boolean;
    consulterFacture: boolean;
    ajouterFacture: boolean;
    modifierFacture: boolean;
    supprimerFacture: boolean;
    consulterEntretien: boolean;
    ajouterEntretien: boolean;
    modifierEntretien: boolean;
    supprimerEntretien: boolean;
}

export function initObjectPersonnel(): Personnel {
    return {
        id: null,
        designation: '',
        cin: '',
        login: '',
        password: '',
        passwordFake: '',
        typePersonnel: 0,
        etatComptePersonnel: false,
        tel1: '',
        tel2: '',
        adresse: '',
        email: '',
        dateEntrer: new Date(),
        dateSuppression: null,
        salaire: 0,
        canDelete: false,
        archiver: false,
        supprimer: false,
        consulterStock: false,
        ajouterStock: false,
        modifierStock: false,
        supprimerStock: false,
        consulterRepertoire: false,
        ajouterRepertoire: false,
        modifierRepertoire: false,
        supprimerRepertoire: false,
        consulterTransport: false,
        ajouterTransport: false,
        modifierTransport: false,
        supprimerTransport: false,
        consulterLivraison: false,
        ajouterLivraison: false,
        modifierLivraison: false,
        supprimerLivraison: false,
        consulterFacture: false,
        ajouterFacture: false,
        modifierFacture: false,
        supprimerFacture: false,
        consulterEntretien: false,
        ajouterEntretien: false,
        modifierEntretien: false,
        supprimerEntretien: false
    };
}
