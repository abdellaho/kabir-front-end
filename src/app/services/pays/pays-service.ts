import { ENDPOINTS } from '@/config/endpoints';
import { Pays } from '@/models/pays';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaysService {

  constructor(private http: HttpClient) { }

  getPays(): Observable<Pays[]> {
    return this.http.get<Pays[]>(ENDPOINTS.PAYS.getAll);
  }

  getPaysById(id: bigint): Observable<Pays> {
    return this.http.get<Pays>(ENDPOINTS.PAYS.getById(id));
  }

  createPays(pays: Pays): Observable<Pays> {
    return this.http.post<Pays>(ENDPOINTS.PAYS.create, pays);
  }

  updatePays(id: bigint, pays: Pays): Observable<Pays> {
    return this.http.put<Pays>(ENDPOINTS.PAYS.update(id), pays);
  }

  deletePays(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.PAYS.delete(id));
  }
  
}
