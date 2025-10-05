import { ENDPOINTS } from '@/config/endpoints';
import { Etablissement } from '@/models/etablissement';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtablissementService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Etablissement[]> {
    return this.http.get<Etablissement[]>(ENDPOINTS.ETABLISSEMENT.getAll);
  }

  getById(id: bigint): Observable<Etablissement> {
    return this.http.get<Etablissement>(ENDPOINTS.ETABLISSEMENT.getById(id));
  }

  create(ville: Etablissement): Observable<Etablissement> {
    return this.http.post<Etablissement>(ENDPOINTS.ETABLISSEMENT.create, ville);
  }

  update(id: bigint, ville: Etablissement): Observable<Etablissement> {
    return this.http.patch<Etablissement>(ENDPOINTS.ETABLISSEMENT.update(id), ville);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.ETABLISSEMENT.delete(id));
  }
}
