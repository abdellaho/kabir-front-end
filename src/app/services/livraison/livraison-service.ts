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
    const objLivraison = this.omitLivraison(livraisonRequest.livraison);
    const objListDetLivraison = livraisonRequest.detLivraisons.map(detLivraison => this.omitDetLivraison(detLivraison));

    const obj: LivraisonRequest = { livraison: objLivraison, detLivraisons: objListDetLivraison };
    return this.http.post<Livraison>(ENDPOINTS.LIVRAISON.create, obj);
  }

  update(id: bigint, livraisonRequest: LivraisonRequest): Observable<Livraison> {
    const objLivraison = this.omitLivraison(livraisonRequest.livraison);
    const objListDetLivraison = livraisonRequest.detLivraisons.map(detLivraison => this.omitDetLivraison(detLivraison));

    const obj: LivraisonRequest = { livraison: objLivraison, detLivraisons: objListDetLivraison };
    return this.http.patch<Livraison>(ENDPOINTS.LIVRAISON.update(id), obj);
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
    const objLivraison = omit(this.serializationLivraison(livraison), 'employeOperateur', 'personnel', 'personnelAncien', 'repertoire');
    return objLivraison;
  }

  omitDetLivraison(detLivraison: DetLivraison): DetLivraison {
    const objDetLivraison = omit(this.serializationDetLivraison(detLivraison), 'livraison', 'stock');
    return objDetLivraison;
  }

  serializationLivraison(obj: Livraison): any {
    const result: any = {
      ...obj,
      id: obj.id?.toString(),
    };
    if (obj.dateReglement2 == null) {
      delete result.dateReglement2;
    }
    if (obj.dateReglement3 == null) {
      delete result.dateReglement3;
    }
    if (obj.dateReglement4 == null) {
      delete result.dateReglement4;
    }
    return result;
  }

  serializationDetLivraison(obj: DetLivraison): any {
    return {
      ...obj,
      id: obj.id?.toString(),
    };
  }
  
}
