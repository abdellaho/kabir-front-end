import { ENDPOINTS } from '@/config/endpoints';
import { BonSortie } from '@/models/bon-sortie';
import { BonSortieRequest } from '@/shared/classes/bon-sortie-request';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BonSortieService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<BonSortie[]> {
      return this.http.get<BonSortie[]>(ENDPOINTS.BON_SORTIE.getAll);
  }

  getById(id: bigint): Observable<BonSortie> {
      return this.http.get<BonSortie>(ENDPOINTS.BON_SORTIE.getById(id));
  }

  getByIdRequest(id: bigint): Observable<BonSortieRequest> {
      return this.http.get<BonSortieRequest>(ENDPOINTS.BON_SORTIE.getByIdRequest(id));
  }

  create(bonSortieRequest: BonSortieRequest): Observable<BonSortie> {
      //const obj = this.serialization(stockDepotRequest);
      return this.http.post<BonSortie>(ENDPOINTS.BON_SORTIE.create, bonSortieRequest);
  }

  update(id: bigint, bonSortieRequest: BonSortieRequest): Observable<BonSortie> {
      //const obj = this.serialization(stockDepotRequest);
      return this.http.patch<BonSortie>(ENDPOINTS.BON_SORTIE.update(id), bonSortieRequest);
  }

  getLastNumBonSortie(body: BonSortie): Observable<number> {
    return this.http.post<number>(ENDPOINTS.BON_SORTIE.getLastNumBonSortie, body);
  }

  delete(id: bigint): Observable<void> {
      return this.http.delete<void>(ENDPOINTS.BON_SORTIE.delete(id));
  }

  serialization(obj: BonSortieRequest): any {
      return {
          ...obj,
      };
  }
  
}
