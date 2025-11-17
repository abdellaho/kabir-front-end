import { ENDPOINTS } from '@/config/endpoints';
import { Repertoire } from '@/models/repertoire';
import { omit } from '@/shared/classes/generic-methods';
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

  create(repertoire: Repertoire): Observable<Repertoire> {
    const serializedObj = this.serialization(repertoire);
    const obj = omit(serializedObj, 'ville', 'personnel');
    return this.http.post<Repertoire>(ENDPOINTS.REPERTOIRE.create, obj);
  }

  update(id: bigint, repertoire: Repertoire): Observable<Repertoire> {
    const serializedObj = this.serialization(repertoire);
    const obj = omit(serializedObj, 'ville', 'personnel');
    return this.http.patch<Repertoire>(ENDPOINTS.REPERTOIRE.update(id), obj);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.REPERTOIRE.delete(id));
  }

  search(repertoire: Repertoire): Observable<Repertoire[]> {
    const serializedObj = this.serialization(repertoire);
    const obj = omit(serializedObj, 'ville', 'personnel');
    return this.http.post<Repertoire[]>(ENDPOINTS.REPERTOIRE.search, obj);
  }

  exist(repertoire: Repertoire): Observable<boolean> {
    const serializedObj = this.serialization(repertoire);
    return this.http.post<boolean>(ENDPOINTS.REPERTOIRE.exist, serializedObj);
  }

  serialization(repertoire: Repertoire): any {
    return {
      ...repertoire,
      id: repertoire.id?.toString(),
      villeId: repertoire.villeId?.toString(),
      personnelId: repertoire.personnelId?.toString(),
    };
  }

}
