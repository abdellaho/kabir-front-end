import { ENDPOINTS } from '@/config/endpoints';
import { Voiture } from '@/models/voiture';
import { omit } from '@/shared/classes/generic-methods';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Voiture[]> {
    return this.http.get<Voiture[]>(ENDPOINTS.VOITURE.getAll);
  }

  getById(id: bigint): Observable<Voiture> {
    return this.http.get<Voiture>(ENDPOINTS.VOITURE.getById(id));
  }

  create(absence: Voiture): Observable<Voiture> {
    const serializedObj = this.serialization(absence);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.post<Voiture>(ENDPOINTS.VOITURE.create, obj);
  }

  update(id: bigint, absence: Voiture): Observable<Voiture> {
    const serializedObj = this.serialization(absence);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.patch<Voiture>(ENDPOINTS.VOITURE.update(id), obj);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.VOITURE.delete(id));
  }

  exist(voiture: Voiture): Observable<boolean> {
    return this.http.put<boolean>(ENDPOINTS.VOITURE.search, voiture);
  }

  serialization(obj: Voiture): any {
    return {
      ...obj,
      id: obj.id?.toString(),
    };
  }
  
}
