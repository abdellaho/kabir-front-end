import { environment } from "src/environments/environment.development";

const BASE_URL = environment.production ? 'http://localhost:3000/api' : 'http://localhost:3000/api';

export const ENDPOINTS = {
  VILLE: {
    getAll: `${BASE_URL}/ville`,
    getById: (id: bigint) => `${BASE_URL}/ville/${id}`,
    create: `${BASE_URL}/ville`,
    update: (id: bigint) => `${BASE_URL}/ville/${id}`,
    delete: (id: bigint) => `${BASE_URL}/ville/${id}`,
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
    delete: (id: bigint) => `${BASE_URL}/etablissement/${id}`,
  },
  REPERTOIRE: {
    getAll: `${BASE_URL}/repertoire`,
    getById: (id: bigint) => `${BASE_URL}/repertoire/${id}`,
    create: `${BASE_URL}/repertoire`,
    update: (id: bigint) => `${BASE_URL}/repertoire/${id}`,
    delete: (id: bigint) => `${BASE_URL}/repertoire/${id}`,
    searchPersonnel: `${BASE_URL}/repertoire/search-personnel`,
  },
  ABSENCE: {
    getAll: `${BASE_URL}/absence`,
    getById: (id: bigint) => `${BASE_URL}/absence/${id}`,
    create: `${BASE_URL}/absence`,
    update: (id: bigint) => `${BASE_URL}/absence/${id}`,
    delete: (id: bigint) => `${BASE_URL}/absence/${id}`,
    search: `${BASE_URL}/absence/search`,
  },
  FOURNISSEUR: {
    getAll: `${BASE_URL}/fournisseur`,
    getById: (id: bigint) => `${BASE_URL}/fournisseur/${id}`,
    create: `${BASE_URL}/fournisseur`,
    update: (id: bigint) => `${BASE_URL}/fournisseur/${id}`,
    delete: (id: bigint) => `${BASE_URL}/fournisseur/${id}`,
    search: `${BASE_URL}/fournisseur/search`,
  },
  COMPTE: {
    getAll: `${BASE_URL}/compte`,
    getById: (id: bigint) => `${BASE_URL}/compte/${id}`,
    create: `${BASE_URL}/compte`,
    update: (id: bigint) => `${BASE_URL}/compte/${id}`,
    delete: (id: bigint) => `${BASE_URL}/compte/${id}`,
    search: `${BASE_URL}/compte/search`,
  },
  PERSONNEL: {
    getAll: `${BASE_URL}/personnel`,
    getById: (id: bigint) => `${BASE_URL}/personnel/${id}`,
    create: `${BASE_URL}/personnel`,
    update: (id: bigint) => `${BASE_URL}/personnel/${id}`,
    delete: (id: bigint) => `${BASE_URL}/personnel/${id}`,
    search: `${BASE_URL}/personnel/search`,
  },
  PRIME: {
    getAll: `${BASE_URL}/prime`,
    getById: (id: bigint) => `${BASE_URL}/prime/${id}`,
    create: `${BASE_URL}/prime`,
    update: (id: bigint) => `${BASE_URL}/prime/${id}`,
    delete: (id: bigint) => `${BASE_URL}/prime/${id}`,
    search: `${BASE_URL}/prime/search`,
  },
  STOCK: {
    getAll: `${BASE_URL}/stock`,
    getById: (id: bigint) => `${BASE_URL}/stock/${id}`,
    create: `${BASE_URL}/stock`,
    update: (id: bigint) => `${BASE_URL}/stock/${id}`,
    delete: (id: bigint) => `${BASE_URL}/stock/${id}`,
    search: `${BASE_URL}/stock/search`,
  },
  VOITURE: {
    getAll: `${BASE_URL}/voiture`,
    getById: (id: bigint) => `${BASE_URL}/voiture/${id}`,
    create: `${BASE_URL}/voiture`,
    update: (id: bigint) => `${BASE_URL}/voiture/${id}`,
    delete: (id: bigint) => `${BASE_URL}/voiture/${id}`,
    search: `${BASE_URL}/voiture/search`,
  }
};