import { ENDPOINTS } from '@/config/endpoints';
import { Pays } from '@/models/pays';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaysService {

  constructor(private http: HttpClient) { }

  getPays() {
    return this.http.get(ENDPOINTS.PAYS.getAll);
  }

  getPaysById(id: number) {
    return this.http.get(ENDPOINTS.PAYS.getById(id));
  }

  createPays(pays: Pays) {
    return this.http.post(ENDPOINTS.PAYS.create, pays);
  }

  updatePays(id: number, pays: Pays) {
    return this.http.put(ENDPOINTS.PAYS.update(id), pays);
  }

  deletePays(id: number) {
    return this.http.delete(ENDPOINTS.PAYS.delete(id));
  }
  
}
