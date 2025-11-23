export interface Personnel {
    id: bigint | null;
    designation: string;
    cin: string;
    login: string;
    password: string;
    typePersonnel: number;
    etatComptePersonnel: boolean;
    tel1: string;
    tel2: string;
    adresse: string;
    email: string;
    dateEntrer: Date;
    salaire: number;
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
}

export function initObjectPersonnel(): Personnel {
    return {
        id: null,
        designation: '',
        cin: '',
        login: '',
        password: '',
        typePersonnel: 0,
        etatComptePersonnel: false,
        tel1: '',
        tel2: '',
        adresse: '',
        email: '',
        dateEntrer: new Date(),
        salaire: 0,
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
    }
}