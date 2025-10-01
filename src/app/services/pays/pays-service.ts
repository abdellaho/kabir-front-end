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
    console.log("Pays Object : " + pays.id + " - " + pays.pays);
    const obj = this.convertObjectToPays(pays);
    return this.http.post<Pays>(ENDPOINTS.PAYS.create, obj);
  }

  updatePays(id: bigint, pays: Pays): Observable<Pays> {
    const obj = this.convertObjectToPays(pays);
    return this.http.put<Pays>(ENDPOINTS.PAYS.update(id), obj);
  }

  deletePays(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.PAYS.delete(id));
  }

  convertObjectToPays(pays: Pays): any {
    return {
      ...pays,
      id: pays.id?.toString()
    };
  }
  
}
