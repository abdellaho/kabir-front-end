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
        supprimer: false
    }
}