import { environment } from "src/environments/environment.development";

const BASE_URL = environment.production ? 'http://localhost:3000/api' : 'http://localhost:3000/api';

export const ENDPOINTS = {
  VILLE: {
    getAll: `${BASE_URL}/villes`,
    getById: (id: number) => `${BASE_URL}/ville/${id}`,
    create: `${BASE_URL}/ville`,
    update: (id: number) => `${BASE_URL}/ville/${id}`,
    delete: (id: number) => `${BASE_URL}/ville/${id}`,
  }, 
  PAYS: {
    getAll: `${BASE_URL}/pays`,
    getById: (id: number) => `${BASE_URL}/pays/${id}`,
    create: `${BASE_URL}/pays`,
    update: (id: number) => `${BASE_URL}/pays/${id}`,
    delete: (id: number) => `${BASE_URL}/pays/${id}`,
  }
};