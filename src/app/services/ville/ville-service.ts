import { ENDPOINTS } from '@/config/endpoints';
import { Ville } from '@/models/ville';
import { getHeadersPDF } from '@/shared/classes/generic-methods';
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

  getVillesWithCount(): Observable<Ville[]> {
    return this.http.get<Ville[]>(`${ENDPOINTS.VILLE.getAll}?withCount=true`);
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

  exist(ville: Ville): Observable<boolean> {
    const obj = this.serialization(ville);
    return this.http.post<boolean>(ENDPOINTS.VILLE.exist, obj);
  }

  imprimer(): Observable<any> {
    return this.http.get(ENDPOINTS.VILLE.imprimer, { headers: getHeadersPDF(), responseType: 'blob' as 'json' });
  }

  serialization(obj: Ville): any {
    const { nbrRepertoire, ...rest } = obj;   // derived, read-only, GET-only
    return {
      ...rest,
      id: obj.id?.toString(),
    };
  }

}
