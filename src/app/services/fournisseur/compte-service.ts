import { ENDPOINTS } from '@/config/endpoints';
import { Compte } from '@/models/compte';
import { omit } from '@/shared/classes/generic-methods';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompteService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Compte[]> {
    return this.http.get<Compte[]>(ENDPOINTS.COMPTE.getAll);
  }

  getById(id: bigint): Observable<Compte> {
    return this.http.get<Compte>(ENDPOINTS.COMPTE.getById(id));
  }

  create(compte: Compte): Observable<Compte> {
    const serializedObj = this.serialization(compte);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.post<Compte>(ENDPOINTS.COMPTE.create, obj);
  }

  update(id: bigint, compte: Compte): Observable<Compte> {
    const serializedObj = this.serialization(compte);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.patch<Compte>(ENDPOINTS.COMPTE.update(id), obj);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.COMPTE.delete(id));
  }

  serialization(obj: Compte): any {
    return {
      ...obj,
      id: obj.id?.toString(),
    };
  }
  
}
