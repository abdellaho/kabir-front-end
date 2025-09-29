import { ENDPOINTS } from '@/config/endpoints';
import { Ville } from '@/models/ville';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VilleService {

  constructor(private http: HttpClient) {}

  getVilles() {
    return this.http.get(ENDPOINTS.VILLE.getAll);
  }

  getVilleById(id: number) {
    return this.http.get(ENDPOINTS.VILLE.getById(id));
  }

  createVille(ville: Ville) {
    return this.http.post(ENDPOINTS.VILLE.create, ville);
  }

  updateVille(id: number, ville: Ville) {
    return this.http.put(ENDPOINTS.VILLE.update(id), ville);
  }

  deleteVille(id: number) {
    return this.http.delete(ENDPOINTS.VILLE.delete(id));
  }
  
}
