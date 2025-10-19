import { ENDPOINTS } from '@/config/endpoints';
import { Etablissement } from '@/models/etablissement';
import { omit } from '@/shared/classes/generic-methods';
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

  create(etablissement: Etablissement): Observable<Etablissement> {
    const serializedObj = this.serialization(etablissement);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.post<Etablissement>(ENDPOINTS.ETABLISSEMENT.create, obj);
  }

  update(id: bigint, etablissement: Etablissement): Observable<Etablissement> {
    const serializedObj = this.serialization(etablissement);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.patch<Etablissement>(ENDPOINTS.ETABLISSEMENT.update(id), obj);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.ETABLISSEMENT.delete(id));
  }

  serialization(obj: Etablissement): any {
    return {
      ...obj,
      id: obj.id?.toString(),
    };
  }
}
