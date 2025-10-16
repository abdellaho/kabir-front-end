import { ENDPOINTS } from '@/config/endpoints';
import { Ville } from '@/models/ville';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VilleService {

  constructor(private http: HttpClient) {}

  getVilles(): Observable<Ville[]> {
    return this.http.get<Ville[]>(ENDPOINTS.VILLE.getAll);
  }

  getVilleById(id: bigint): Observable<Ville> {
    return this.http.get<Ville>(ENDPOINTS.VILLE.getById(id));
  }

  createVille(ville: Ville): Observable<Ville> {
    const obj = this.serialization(ville);
    return this.http.post<Ville>(ENDPOINTS.VILLE.create, obj);
  }

  updateVille(id: bigint, ville: Ville): Observable<Ville> {
    const obj = this.serialization(ville);
    return this.http.patch<Ville>(ENDPOINTS.VILLE.update(id), obj);
  }

  deleteVille(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.VILLE.delete(id));
  }

  serialization(obj: Ville): any {
    return {
      ...obj,
      id: obj.id?.toString(),
    };
  }

}
