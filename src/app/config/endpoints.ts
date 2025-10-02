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
  }
};