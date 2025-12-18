import { ENDPOINTS } from '@/config/endpoints';
import { DetLivraison } from '@/models/det-livraison';
import { Livraison } from '@/models/livraison';
import { omit } from '@/shared/classes/generic-methods';
import { LivraisonRequest } from '@/shared/classes/livraison-request';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  

  constructor(private http: HttpClient) {}

  getAll(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(ENDPOINTS.LIVRAISON.getAll);
  }

  getById(id: bigint): Observable<Livraison> {
    return this.http.get<Livraison>(ENDPOINTS.LIVRAISON.getById(id));
  }

  getByIdWithDetLivraison(id: bigint): Observable<LivraisonRequest> {
    return this.http.get<LivraisonRequest>(ENDPOINTS.LIVRAISON.getByIdWithDetLivraison(id));
  }

  create(livraisonRequest: LivraisonRequest): Observable<Livraison> {
    const obj = this.omitLivraison(livraisonRequest.livraison);
    return this.http.post<Livraison>(ENDPOINTS.LIVRAISON.create, obj);
  }

  update(id: bigint, livraisonRequest: LivraisonRequest): Observable<Livraison> {
    const objLivraison = this.omitLivraison(livraisonRequest.livraison);
    return this.http.patch<Livraison>(ENDPOINTS.LIVRAISON.update(id), objLivraison);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.LIVRAISON.delete(id));
  }

  search(livraison: Livraison): Observable<Livraison[]> {
    const obj = this.omitLivraison(livraison);
    return this.http.post<Livraison[]>(ENDPOINTS.LIVRAISON.search, obj);
  }

  exist(livraison: Livraison): Observable<boolean> {
    const obj = this.omitLivraison(livraison);
    return this.http.post<boolean>(ENDPOINTS.LIVRAISON.exist, obj);
  }

  present(dateAbsence: Date): Observable<Livraison[]> {
    let body = { dateAbsence };
    return this.http.post<Livraison[]>(ENDPOINTS.LIVRAISON.present, body);
  }

  getLastNumLivraison(body: { dateBl: string; id: number | null }): Observable<number> {
    return this.http.post<number>(ENDPOINTS.LIVRAISON.getLastNumLivraison, body);
  }

  omitLivraison(livraison: Livraison): Livraison {
    const objLivraison = omit(livraison, 'employeOperateur', 'personnel', 'personnelAncien', 'fournisseur');
    return objLivraison;
  }

  omitDetLivraison(detLivraison: DetLivraison): DetLivraison {
    const objDetLivraison = omit(detLivraison, 'livraison', 'stock');
    return objDetLivraison;
  }

  serialization(obj: Livraison): any {
    return {
      ...obj,
      id: obj.id?.toString(),
    };
  }
  
}
