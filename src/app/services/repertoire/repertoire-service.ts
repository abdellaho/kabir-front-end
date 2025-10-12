import { ENDPOINTS } from '@/config/endpoints';
import { Repertoire } from '@/models/Repertoire';
import { PersonnelSearch } from '@/shared/searchModels/personnel-search';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepertoireService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Repertoire[]> {
    return this.http.get<Repertoire[]>(ENDPOINTS.REPERTOIRE.getAll);
  }

  getById(id: bigint): Observable<Repertoire> {
    return this.http.get<Repertoire>(ENDPOINTS.REPERTOIRE.getById(id));
  }

  create(ville: Repertoire): Observable<Repertoire> {
    return this.http.post<Repertoire>(ENDPOINTS.REPERTOIRE.create, ville);
  }

  update(id: bigint, ville: Repertoire): Observable<Repertoire> {
    return this.http.patch<Repertoire>(ENDPOINTS.REPERTOIRE.update(id), ville);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.REPERTOIRE.delete(id));
  }

  searchPersonnel(personnelSearch: PersonnelSearch): Observable<boolean> {
    return this.http.post<boolean>(ENDPOINTS.REPERTOIRE.searchPersonnel, personnelSearch);
  }
  
}
