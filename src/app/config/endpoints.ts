import { environment } from 'src/environments/environment';

const BASE_URL = environment.production ? '/api' : 'http://localhost:8080/api';
const FACTURE = `facture`;
const BON_SORTIE = `bon-sortie`;
const ACHAT_FACTURE = `achat-facture`;
const ACHAT_SIMPLE = `achat-simple`;
const ACHAT_ETRANGER = `achat-etranger`;
const CAISSE = `caisse`;
const CHEQUE = `cheque`;
const REPERTOIRE = `repertoire`;

export const ENDPOINTS = {
    VILLE: {
        getAll: `${BASE_URL}/ville`,
        getById: (id: bigint) => `${BASE_URL}/ville/${id}`,
        create: `${BASE_URL}/ville`,
        update: (id: bigint) => `${BASE_URL}/ville/${id}`,
        delete: (id: bigint) => `${BASE_URL}/ville/${id}`,
        exist: `${BASE_URL}/ville/exist`
    },
    PAYS: {
        getAll: `${BASE_URL}/pays`,
        getById: (id: bigint) => `${BASE_URL}/pays/${id}`,
        create: `${BASE_URL}/pays`,
        update: (id: bigint) => `${BASE_URL}/pays/${id}`,
        delete: (id: bigint) => `${BASE_URL}/pays/${id}`,
        search: `${BASE_URL}/pays/search`,
        exist: `${BASE_URL}/pays/exist`
    },
    ETABLISSEMENT: {
        getAll: `${BASE_URL}/etablissement`,
        getById: (id: bigint) => `${BASE_URL}/etablissement/${id}`,
        create: `${BASE_URL}/etablissement`,
        update: (id: bigint) => `${BASE_URL}/etablissement/${id}`,
        delete: (id: bigint) => `${BASE_URL}/etablissement/${id}`
    },
    STOCK_DEPOT: {
        getAll: `${BASE_URL}/stock-depot`,
        getById: (id: bigint) => `${BASE_URL}/stock-depot/${id}`,
        getByIdRequest: (id: bigint) => `${BASE_URL}/stock-depot/response/${id}`,
        create: `${BASE_URL}/stock-depot`,
        update: (id: bigint) => `${BASE_URL}/stock-depot/${id}`,
        delete: (id: bigint) => `${BASE_URL}/stock-depot/${id}`
    },
    REPERTOIRE: {
        getAll: `${BASE_URL}/${REPERTOIRE}`,
        getById: (id: bigint) => `${BASE_URL}/${REPERTOIRE}/${id}`,
        create: `${BASE_URL}/${REPERTOIRE}`,
        update: (id: bigint) => `${BASE_URL}/${REPERTOIRE}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${REPERTOIRE}/${id}`,
        exist: `${BASE_URL}/${REPERTOIRE}/exist`,
        search: `${BASE_URL}/${REPERTOIRE}/search`,
        searchClientsOnly: `${BASE_URL}/${REPERTOIRE}/search/clients`,
        searchPersonnel: `${BASE_URL}/${REPERTOIRE}/search-personnel`,
        updateNbrOperation: (id: bigint, nbrOperation: number) => `${BASE_URL}/${REPERTOIRE}/${id}/update-nbr-operation/${nbrOperation}`
    },
    ABSENCE: {
        getAll: `${BASE_URL}/absence`,
        getById: (id: bigint) => `${BASE_URL}/absence/${id}`,
        create: `${BASE_URL}/absence`,
        update: (id: bigint) => `${BASE_URL}/absence/${id}`,
        delete: (id: bigint) => `${BASE_URL}/absence/${id}`,
        exist: `${BASE_URL}/absence/exist`,
        search: `${BASE_URL}/absence/search`
    },
    FOURNISSEUR: {
        getAll: `${BASE_URL}/fournisseur`,
        getById: (id: bigint) => `${BASE_URL}/fournisseur/${id}`,
        create: `${BASE_URL}/fournisseur`,
        update: (id: bigint) => `${BASE_URL}/fournisseur/${id}`,
        delete: (id: bigint) => `${BASE_URL}/fournisseur/${id}`,
        exist: `${BASE_URL}/fournisseur/exist`,
        search: `${BASE_URL}/fournisseur/search`,
        updateNbrOperation: (id: bigint, nbrOperation: number) => `${BASE_URL}/fournisseur/${id}/update-nbr-operation/${nbrOperation}`
    },
    COMPTE: {
        getAll: `${BASE_URL}/compte`,
        getById: (id: bigint) => `${BASE_URL}/compte/${id}`,
        create: `${BASE_URL}/compte`,
        update: (id: bigint) => `${BASE_URL}/compte/${id}`,
        delete: (id: bigint) => `${BASE_URL}/compte/${id}`,
        search: `${BASE_URL}/compte/search`
    },
    PERSONNEL: {
        getAll: `${BASE_URL}/personnel`,
        getAllAlowed: `${BASE_URL}/personnel/allowed`,
        getById: (id: bigint) => `${BASE_URL}/personnel/${id}`,
        create: `${BASE_URL}/personnel`,
        update: (id: bigint) => `${BASE_URL}/personnel/${id}`,
        delete: (id: bigint) => `${BASE_URL}/personnel/${id}`,
        exist: `${BASE_URL}/personnel/exist`,
        search: `${BASE_URL}/personnel/search`,
        present: `${BASE_URL}/personnel/present`,
        auth: {
            login: `${BASE_URL}/personnel/auth/login`,
            register: `${BASE_URL}/personnel/auth/register`,
            refresh: `${BASE_URL}/personnel/auth/refresh-token`,
            logout: `${BASE_URL}/personnel/auth/logout`,
            adminExist: `${BASE_URL}/personnel/auth/admin-exist`,
            me: `${BASE_URL}/personnel/auth/me`
        }
    },
    PRIME: {
        getAll: `${BASE_URL}/prime`,
        getById: (id: bigint) => `${BASE_URL}/prime/${id}`,
        create: `${BASE_URL}/prime`,
        update: (id: bigint) => `${BASE_URL}/prime/${id}`,
        delete: (id: bigint) => `${BASE_URL}/prime/${id}`,
        search: `${BASE_URL}/prime/search`
    },
    STOCK: {
        getAll: `${BASE_URL}/stock`,
        getById: (id: bigint) => `${BASE_URL}/stock/${id}`,
        create: `${BASE_URL}/stock`,
        update: (id: bigint) => `${BASE_URL}/stock/${id}`,
        delete: (id: bigint) => `${BASE_URL}/stock/${id}`,
        exist: `${BASE_URL}/stock/exist`,
        search: `${BASE_URL}/stock/search`,
        updateQteStock: (id: bigint) => `${BASE_URL}/stock/${id}/update-qte-stock`,
        updateQteStockImport: (id: bigint) => `${BASE_URL}/stock/${id}/update-qte-stock-import`,
        updateQteStockFacturer: (id: bigint) => `${BASE_URL}/stock/${id}/update-qte-stock-facturer`
    },
    VOITURE: {
        getAll: `${BASE_URL}/voiture`,
        getById: (id: bigint) => `${BASE_URL}/voiture/${id}`,
        create: `${BASE_URL}/voiture`,
        update: (id: bigint) => `${BASE_URL}/voiture/${id}`,
        delete: (id: bigint) => `${BASE_URL}/voiture/${id}`,
        exist: `${BASE_URL}/voiture/exist`,
        search: `${BASE_URL}/voiture/search`
    },
    LIVRAISON: {
        getAll: `${BASE_URL}/livraison`,
        getById: (id: bigint) => `${BASE_URL}/livraison/${id}`,
        getByIdWithDetLivraison: (id: bigint) => `${BASE_URL}/livraison/${id}/with-det-livraison`,
        create: `${BASE_URL}/livraison`,
        update: (id: bigint) => `${BASE_URL}/livraison/${id}`,
        delete: (id: bigint) => `${BASE_URL}/livraison/${id}`,
        exist: `${BASE_URL}/livraison/exist`,
        search: `${BASE_URL}/livraison/search`,
        present: `${BASE_URL}/livraison/present`,
        getLastNumLivraison: `${BASE_URL}/livraison/last-num-livraison`
    },
    DET_LIVRAISON: {
        getAll: `${BASE_URL}/det-livraison`,
        getById: (id: bigint) => `${BASE_URL}/det-livraison/${id}`,
        create: `${BASE_URL}/det-livraison`,
        update: (id: bigint) => `${BASE_URL}/det-livraison/${id}`,
        delete: (id: bigint) => `${BASE_URL}/det-livraison/${id}`,
        getByLivraison: (idLivraison: bigint) => `${BASE_URL}/det-livraison/livraison/${idLivraison}`,
        exist: `${BASE_URL}/det-livraison/exist`,
        search: `${BASE_URL}/det-livraison/search`,
        present: `${BASE_URL}/det-livraison/present`
    },
    FACTURE: {
        getAll: `${BASE_URL}/${FACTURE}`,
        getById: (id: bigint) => `${BASE_URL}/${FACTURE}/${id}`,
        getByIdRequest: (id: bigint) => `${BASE_URL}/${FACTURE}/response/${id}`,
        create: `${BASE_URL}/${FACTURE}`,
        update: (id: bigint) => `${BASE_URL}/${FACTURE}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${FACTURE}/${id}`,
        getLastNumFacture: `${BASE_URL}/${FACTURE}/last-num-facture`
    },
    BON_SORTIE: {
        getAll: `${BASE_URL}/${BON_SORTIE}`,
        getById: (id: bigint) => `${BASE_URL}/${BON_SORTIE}/${id}`,
        getByIdRequest: (id: bigint) => `${BASE_URL}/${BON_SORTIE}/response/${id}`,
        create: `${BASE_URL}/${BON_SORTIE}`,
        update: (id: bigint) => `${BASE_URL}/${BON_SORTIE}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${BON_SORTIE}/${id}`,
        getLastNumBonSortie: `${BASE_URL}/${BON_SORTIE}/last-num-bon-sortie`
    },
    ACHAT_SIMPLE: {
        getAll: `${BASE_URL}/${ACHAT_SIMPLE}`,
        getById: (id: bigint) => `${BASE_URL}/${ACHAT_SIMPLE}/${id}`,
        getByIdRequest: (id: bigint) => `${BASE_URL}/${ACHAT_SIMPLE}/response/${id}`,
        create: `${BASE_URL}/${ACHAT_SIMPLE}`,
        update: (id: bigint) => `${BASE_URL}/${ACHAT_SIMPLE}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${ACHAT_SIMPLE}/${id}`,
        exist: `${BASE_URL}/${ACHAT_SIMPLE}/exist`,
        search: `${BASE_URL}/${ACHAT_SIMPLE}/search`,
        present: `${BASE_URL}/${ACHAT_SIMPLE}/present`,
        getLastNumAchatSimple: `${BASE_URL}/${ACHAT_SIMPLE}/last-num-achat-simple`
    },
    ACHAT_FACTURE: {
        getAll: `${BASE_URL}/${ACHAT_FACTURE}`,
        getById: (id: bigint) => `${BASE_URL}/${ACHAT_FACTURE}/${id}`,
        getByIdRequest: (id: bigint) => `${BASE_URL}/${ACHAT_FACTURE}/response/${id}`,
        create: `${BASE_URL}/${ACHAT_FACTURE}`,
        update: (id: bigint) => `${BASE_URL}/${ACHAT_FACTURE}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${ACHAT_FACTURE}/${id}`,
        search: `${BASE_URL}/${ACHAT_FACTURE}/search`,
        exist: `${BASE_URL}/${ACHAT_FACTURE}/exist`,
        getLastNumAchatFacture: `${BASE_URL}/${ACHAT_FACTURE}/last-num-achat-facture`
    },
    ACHAT_ETRANGER: {
        getAll: `${BASE_URL}/${ACHAT_ETRANGER}`,
        getById: (id: bigint) => `${BASE_URL}/${ACHAT_ETRANGER}/${id}`,
        getByIdRequest: (id: bigint) => `${BASE_URL}/${ACHAT_ETRANGER}/response/${id}`,
        create: `${BASE_URL}/${ACHAT_ETRANGER}`,
        update: (id: bigint) => `${BASE_URL}/${ACHAT_ETRANGER}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${ACHAT_ETRANGER}/${id}`,
        search: `${BASE_URL}/${ACHAT_ETRANGER}/search`,
        exist: `${BASE_URL}/${ACHAT_ETRANGER}/exist`,
        getLastNumAchatEtranger: `${BASE_URL}/${ACHAT_ETRANGER}/last-num-achat-etranger`
    },
    CAISSE: {
        getAll: `${BASE_URL}/${CAISSE}`,
        getById: (id: bigint) => `${BASE_URL}/${CAISSE}/${id}`,
        create: `${BASE_URL}/${CAISSE}`,
        update: (id: bigint) => `${BASE_URL}/${CAISSE}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${CAISSE}/${id}`,
        exist: `${BASE_URL}/${CAISSE}/exist`,
        search: `${BASE_URL}/${CAISSE}/search`
    },
    CHEQUE: {
        getAll: `${BASE_URL}/${CHEQUE}`,
        getById: (id: bigint) => `${BASE_URL}/${CHEQUE}/${id}`,
        create: `${BASE_URL}/${CHEQUE}`,
        update: (id: bigint) => `${BASE_URL}/${CHEQUE}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${CHEQUE}/${id}`,
        exist: `${BASE_URL}/${CHEQUE}/exist`,
        search: `${BASE_URL}/${CHEQUE}/search`,
        getLastNum: `${BASE_URL}/${CHEQUE}/last-num`
    }
};
