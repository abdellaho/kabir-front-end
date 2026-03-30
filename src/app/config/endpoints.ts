import { environment } from 'src/environments/environment';

const BASE_URL = environment.production ? '/api' : 'http://localhost:8080/api';


const ABSENCE = `absence`;
const ACHAT_FACTURE = `achat-facture`;
const ACHAT_ETRANGER = `achat-etranger`;
const ACHAT_SIMPLE = `achat-simple`;
const BULLETIN_PAI = `bulletin-pai`;
const BON_SORTIE = `bon-sortie`;
const CAISSE = `caisse`;
const CHEQUE = `cheque`;
const COMPTE = `compte`;
const COMPTE_CAISSE = `compte-caisse`;
const COMPTA = `compta`;
const DET_LIVRAISON = `det-livraison`;
const ENTRETIEN = `entretien`;
const ETABLISSEMENT = `etablissement`;
const FACTURE = `facture`;
const FOURNISSEUR = `fournisseur`;
const LIVRAISON = `livraison`;
const PERSONNEL = `personnel`;
const PRIME = `prime`;
const REPERTOIRE = `repertoire`;
const STOCK = `stock`;
const STOCK_DEPOT = `stock-depot`;
const VILLE = `ville`;
const VOITURE = `voiture`;
const PAYS = `pays`;


export const ENDPOINTS = {
    ABSENCE: {
        getAll: `${BASE_URL}/${ABSENCE}`,
        getById: (id: bigint) => `${BASE_URL}/${ABSENCE}/${id}`,
        create: `${BASE_URL}/${ABSENCE}`,
        update: (id: bigint) => `${BASE_URL}/${ABSENCE}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${ABSENCE}/${id}`,
        exist: `${BASE_URL}/${ABSENCE}/exist`,
        search: `${BASE_URL}/${ABSENCE}/search`,
        imprimer: `${BASE_URL}/${ABSENCE}/imprimer`,
        searchByCommon: `${BASE_URL}/${ABSENCE}/searchByCommon`
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
    ACHAT_SIMPLE: {
        getAll: `${BASE_URL}/${ACHAT_SIMPLE}`,
        getById: (id: bigint) => `${BASE_URL}/${ACHAT_SIMPLE}/${id}`,
        getByIdRequest: (id: bigint) => `${BASE_URL}/${ACHAT_SIMPLE}/response/${id}`,
        create: `${BASE_URL}/${ACHAT_SIMPLE}`,
        update: (id: bigint) => `${BASE_URL}/${ACHAT_SIMPLE}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${ACHAT_SIMPLE}/${id}`,
        imprimer: `${BASE_URL}/${ACHAT_SIMPLE}/imprimer`,
        exist: `${BASE_URL}/${ACHAT_SIMPLE}/exist`,
        search: `${BASE_URL}/${ACHAT_SIMPLE}/search`,
        present: `${BASE_URL}/${ACHAT_SIMPLE}/present`,
        getLastNumAchatSimple: `${BASE_URL}/${ACHAT_SIMPLE}/last-num-achat-simple`
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
    BULLETIN_PAI: {
        getAll: `${BASE_URL}/${BULLETIN_PAI}`,
        getById: (id: bigint) => `${BASE_URL}/${BULLETIN_PAI}/${id}`,
        getByIdResponse: (id: bigint) => `${BASE_URL}/${BULLETIN_PAI}/response/${id}`,
        create: `${BASE_URL}/${BULLETIN_PAI}`,
        update: (id: bigint) => `${BASE_URL}/${BULLETIN_PAI}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${BULLETIN_PAI}/${id}`,
        exist: `${BASE_URL}/${BULLETIN_PAI}/exist`,
        search: `${BASE_URL}/${BULLETIN_PAI}/search`,
        getLastNum: `${BASE_URL}/${BULLETIN_PAI}/last-num`,
        details: `${BASE_URL}/${BULLETIN_PAI}/details`,
        detailsOfLivraison: `${BASE_URL}/${BULLETIN_PAI}/details-of-livraison`
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
    },
    COMPTA: {
        getAll: `${BASE_URL}/${COMPTA}`,
        getById: (id: bigint) => `${BASE_URL}/${COMPTA}/${id}`,
        create: `${BASE_URL}/${COMPTA}`,
        update: (id: bigint) => `${BASE_URL}/${COMPTA}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${COMPTA}/${id}`,
        search: `${BASE_URL}/${COMPTA}/search`,
        exist: `${BASE_URL}/${COMPTA}/exist`,
        last: `${BASE_URL}/${COMPTA}/last`,
        globalSums: `${BASE_URL}/${COMPTA}/global-sums`,
        checkIsLast: `${BASE_URL}/${COMPTA}/check-is-last`
    },
    COMPTE_CAISSE: {
        getAll: `${BASE_URL}/${COMPTE_CAISSE}`,
        getById: (id: bigint) => `${BASE_URL}/${COMPTE_CAISSE}/${id}`,
        create: `${BASE_URL}/${COMPTE_CAISSE}`,
        update: (id: bigint) => `${BASE_URL}/${COMPTE_CAISSE}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${COMPTE_CAISSE}/${id}`,
        exist: `${BASE_URL}/${COMPTE_CAISSE}/exist`,
        search: `${BASE_URL}/${COMPTE_CAISSE}/search`
    },
    COMPTE: {
        getAll: `${BASE_URL}/${COMPTE}`,
        getById: (id: bigint) => `${BASE_URL}/${COMPTE}/${id}`,
        create: `${BASE_URL}/${COMPTE}`,
        update: (id: bigint) => `${BASE_URL}/${COMPTE}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${COMPTE}/${id}`,
        search: `${BASE_URL}/${COMPTE}/search`
    },
    DET_LIVRAISON: {
        getAll: `${BASE_URL}/${DET_LIVRAISON}`,
        getById: (id: bigint) => `${BASE_URL}/${DET_LIVRAISON}/${id}`,
        create: `${BASE_URL}/${DET_LIVRAISON}`,
        update: (id: bigint) => `${BASE_URL}/${DET_LIVRAISON}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${DET_LIVRAISON}/${id}`,
        getByLivraison: (idLivraison: bigint) => `${BASE_URL}/${DET_LIVRAISON}/livraison/${idLivraison}`,
        exist: `${BASE_URL}/${DET_LIVRAISON}/exist`,
        search: `${BASE_URL}/${DET_LIVRAISON}/search`,
        present: `${BASE_URL}/${DET_LIVRAISON}/present`
    },
    ENTRETIEN: {
        getAll: `${BASE_URL}/${ENTRETIEN}`,
        getById: (id: bigint) => `${BASE_URL}/${ENTRETIEN}/${id}`,
        create: `${BASE_URL}/${ENTRETIEN}`,
        update: (id: bigint) => `${BASE_URL}/${ENTRETIEN}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${ENTRETIEN}/${id}`,
        exist: `${BASE_URL}/${ENTRETIEN}/exist`,
        search: `${BASE_URL}/${ENTRETIEN}/search`,
        imprimer: `${BASE_URL}/${ENTRETIEN}/imprimer`,
    },
    ETABLISSEMENT: {
        getAll: `${BASE_URL}/${ETABLISSEMENT}`,
        getById: (id: bigint) => `${BASE_URL}/${ETABLISSEMENT}/${id}`,
        create: `${BASE_URL}/${ETABLISSEMENT}`,
        update: (id: bigint) => `${BASE_URL}/${ETABLISSEMENT}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${ETABLISSEMENT}/${id}`
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
    FOURNISSEUR: {
        getAll: `${BASE_URL}/${FOURNISSEUR}`,
        getById: (id: bigint) => `${BASE_URL}/${FOURNISSEUR}/${id}`,
        create: `${BASE_URL}/${FOURNISSEUR}`,
        update: (id: bigint) => `${BASE_URL}/${FOURNISSEUR}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${FOURNISSEUR}/${id}`,
        exist: `${BASE_URL}/${FOURNISSEUR}/exist`,
        existing: `${BASE_URL}/${FOURNISSEUR}/existing`,
        search: `${BASE_URL}/${FOURNISSEUR}/search`,
        updateNbrOperation: (id: bigint, nbrOperation: number) => `${BASE_URL}/${FOURNISSEUR}/${id}/update-nbr-operation/${nbrOperation}`
    },
    LIVRAISON: {
        getAll: `${BASE_URL}/${LIVRAISON}`,
        getById: (id: bigint) => `${BASE_URL}/${LIVRAISON}/${id}`,
        getByIdWithDetLivraison: (id: bigint) => `${BASE_URL}/${LIVRAISON}/${id}/with-det-livraison`,
        create: `${BASE_URL}/${LIVRAISON}`,
        update: (id: bigint) => `${BASE_URL}/${LIVRAISON}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${LIVRAISON}/${id}`,
        exist: `${BASE_URL}/${LIVRAISON}/exist`,
        search: `${BASE_URL}/${LIVRAISON}/search`,
        present: `${BASE_URL}/${LIVRAISON}/present`,
        getLastNumLivraison: `${BASE_URL}/${LIVRAISON}/last-num-livraison`,
        searchByCommon: `${BASE_URL}/${LIVRAISON}/searchByCommon`,
        imprimerBonLivraison: (id: bigint) => `${BASE_URL}/${LIVRAISON}/imprimer/${id}`,
        imprimerClient: (id: bigint) => `${BASE_URL}/${LIVRAISON}/imprimer/${id}/client`
    },
    PAYS: {
        getAll: `${BASE_URL}/${PAYS}`,
        getById: (id: bigint) => `${BASE_URL}/${PAYS}/${id}`,
        create: `${BASE_URL}/${PAYS}`,
        update: (id: bigint) => `${BASE_URL}/${PAYS}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${PAYS}/${id}`,
        search: `${BASE_URL}/${PAYS}/search`,
        exist: `${BASE_URL}/${PAYS}/exist`
    },
    PERSONNEL: {
        getAll: `${BASE_URL}/${PERSONNEL}`,
        getAllAlowed: `${BASE_URL}/${PERSONNEL}/allowed`,
        getById: (id: bigint) => `${BASE_URL}/${PERSONNEL}/${id}`,
        create: `${BASE_URL}/${PERSONNEL}`,
        update: (id: bigint) => `${BASE_URL}/${PERSONNEL}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${PERSONNEL}/${id}`,
        exist: `${BASE_URL}/${PERSONNEL}/exist`,
        existing: `${BASE_URL}/${PERSONNEL}/existing`,
        search: `${BASE_URL}/${PERSONNEL}/search`,
        present: `${BASE_URL}/${PERSONNEL}/present`,
        allExceptAdmin: `${BASE_URL}/${PERSONNEL}/all-except-admin`,
        auth: {
            login: `${BASE_URL}/${PERSONNEL}/auth/login`,
            register: `${BASE_URL}/${PERSONNEL}/auth/register`,
            refresh: `${BASE_URL}/${PERSONNEL}/auth/refresh-token`,
            logout: `${BASE_URL}/${PERSONNEL}/auth/logout`,
            adminExist: `${BASE_URL}/${PERSONNEL}/auth/admin-exist`,
            me: `${BASE_URL}/${PERSONNEL}/auth/me`
        }
    },
    PRIME: {
        getAll: `${BASE_URL}/${PRIME}`,
        getById: (id: bigint) => `${BASE_URL}/${PRIME}/${id}`,
        create: `${BASE_URL}/${PRIME}`,
        update: (id: bigint) => `${BASE_URL}/${PRIME}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${PRIME}/${id}`,
        search: `${BASE_URL}/${PRIME}/search`,
        searchMontant: `${BASE_URL}/${PRIME}/search/montant`
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
        updateNbrOperation: (id: bigint, nbrOperation: number) => `${BASE_URL}/${REPERTOIRE}/${id}/update-nbr-operation/${nbrOperation}`,
        imprimer: `${BASE_URL}/${REPERTOIRE}/imprimer`,
        imprimerTransport: `${BASE_URL}/${REPERTOIRE}/imprimer/transport`,
        imprimerClientAdresse: `${BASE_URL}/${REPERTOIRE}/imprimer/client-adresse`
    },
    STOCK: {
        getAll: `${BASE_URL}/${STOCK}`,
        getAllWithDeleteOption: `${BASE_URL}/${STOCK}/with-delete-option`,
        getById: (id: bigint) => `${BASE_URL}/${STOCK}/${id}`,
        create: `${BASE_URL}/${STOCK}`,
        update: (id: bigint) => `${BASE_URL}/${STOCK}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${STOCK}/${id}`,
        exist: `${BASE_URL}/${STOCK}/exist`,
        search: `${BASE_URL}/${STOCK}/search`,
        searchWithDeleteOption: `${BASE_URL}/${STOCK}/search/with-delete-option`,
        updateQteStock: (id: bigint) => `${BASE_URL}/${STOCK}/${id}/update-qte-stock`,
        updateQteStockImport: (id: bigint) => `${BASE_URL}/${STOCK}/${id}/update-qte-stock-import`,
        updateQteStockFacturer: (id: bigint) => `${BASE_URL}/${STOCK}/${id}/update-qte-stock-facturer`,
        imprimer: `${BASE_URL}/${STOCK}/imprimer`
    },
    STOCK_DEPOT: {
        getAll: `${BASE_URL}/${STOCK_DEPOT}`,
        getAllDetails: `${BASE_URL}/${STOCK_DEPOT}/details`,
        getById: (id: bigint) => `${BASE_URL}/${STOCK_DEPOT}/${id}`,
        getByIdRequest: (id: bigint) => `${BASE_URL}/${STOCK_DEPOT}/response/${id}`,
        create: `${BASE_URL}/${STOCK_DEPOT}`,
        update: (id: bigint) => `${BASE_URL}/${STOCK_DEPOT}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${STOCK_DEPOT}/${id}`,
        imprimer: `${BASE_URL}/${STOCK_DEPOT}/imprimer`
    },
    VOITURE: {
        getAll: `${BASE_URL}/${VOITURE}`,
        getById: (id: bigint) => `${BASE_URL}/${VOITURE}/${id}`,
        create: `${BASE_URL}/${VOITURE}`,
        update: (id: bigint) => `${BASE_URL}/${VOITURE}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${VOITURE}/${id}`,
        exist: `${BASE_URL}/${VOITURE}/exist`,
        search: `${BASE_URL}/${VOITURE}/search`
    },
    VILLE: {
        getAll: `${BASE_URL}/${VILLE}`,
        getById: (id: bigint) => `${BASE_URL}/${VILLE}/${id}`,
        create: `${BASE_URL}/${VILLE}`,
        update: (id: bigint) => `${BASE_URL}/${VILLE}/${id}`,
        delete: (id: bigint) => `${BASE_URL}/${VILLE}/${id}`,
        exist: `${BASE_URL}/${VILLE}/exist`
    },
};
