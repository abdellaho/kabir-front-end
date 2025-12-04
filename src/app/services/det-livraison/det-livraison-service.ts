import { ENDPOINTS } from '@/config/endpoints';
import { DetLivraison } from '@/models/det-livraison';
import { Livraison } from '@/models/livraison';
import { omit } from '@/shared/classes/generic-methods';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetLivraisonService {
  

  constructor(private http: HttpClient) {}

  getAll(): Observable<DetLivraison[]> {
    return this.http.get<DetLivraison[]>(ENDPOINTS.DET_LIVRAISON.getAll);
  }

  getById(id: bigint): Observable<DetLivraison> {
    return this.http.get<DetLivraison>(ENDPOINTS.DET_LIVRAISON.getById(id));
  }

  create(detLivraison: DetLivraison): Observable<DetLivraison> {
    const serializedObj = this.serialization(detLivraison);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.post<DetLivraison>(ENDPOINTS.DET_LIVRAISON.create, obj);
  }

  update(id: bigint, detLivraison: DetLivraison): Observable<DetLivraison> {
    const serializedObj = this.serialization(detLivraison);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.patch<DetLivraison>(ENDPOINTS.DET_LIVRAISON.update(id), obj);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.DET_LIVRAISON.delete(id));
  }

  search(detLivraison: DetLivraison): Observable<DetLivraison[]> {
    const serializedObj = this.serialization(detLivraison);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.post<DetLivraison[]>(ENDPOINTS.DET_LIVRAISON.search, obj);
  }

  exist(detLivraison: DetLivraison): Observable<boolean> {
      const serializedObj = this.serialization(detLivraison);
      const obj = omit(serializedObj, 'villeId', 'ville');
      return this.http.post<boolean>(ENDPOINTS.DET_LIVRAISON.exist, obj);
  }

  present(dateAbsence: Date): Observable<DetLivraison[]> {
    let body = { dateAbsence };
    return this.http.post<DetLivraison[]>(ENDPOINTS.DET_LIVRAISON.present, body);
  }

  getByLivraison(idLivraison: bigint): Observable<DetLivraison[]> {
    return this.http.get<DetLivraison[]>(ENDPOINTS.DET_LIVRAISON.getByLivraison(idLivraison));
  }

  serialization(obj: DetLivraison): any {
    return {
      ...obj,
      id: obj.id?.toString(),
    };
  }
  
}
