import { ENDPOINTS } from '@/config/endpoints';
import { Facture } from '@/models/facture';
import { FactureRequest } from '@/shared/classes/facture-request';
import { getHeadersPDF } from '@/shared/classes/generic-methods';
import { FacturePrintRequest } from '@/shared/classes/requests/facture-print-request';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Facture[]> {
      return this.http.get<Facture[]>(ENDPOINTS.FACTURE.getAll);
  }

  getById(id: bigint): Observable<Facture> {
      return this.http.get<Facture>(ENDPOINTS.FACTURE.getById(id));
  }

  getByIdRequest(id: bigint): Observable<FactureRequest> {
      return this.http.get<FactureRequest>(ENDPOINTS.FACTURE.getByIdRequest(id));
  }

  create(bonSortieRequest: FactureRequest): Observable<Facture> {
      //const obj = this.serialization(stockDepotRequest);
      return this.http.post<Facture>(ENDPOINTS.FACTURE.create, bonSortieRequest);
  }

  update(id: bigint, bonSortieRequest: FactureRequest): Observable<Facture> {
      //const obj = this.serialization(stockDepotRequest);
      return this.http.patch<Facture>(ENDPOINTS.FACTURE.update(id), bonSortieRequest);
  }

  getLastNumFacture(body: Facture): Observable<number> {
    return this.http.post<number>(ENDPOINTS.FACTURE.getLastNumFacture, body);
  }

  delete(id: bigint): Observable<void> {
      return this.http.delete<void>(ENDPOINTS.FACTURE.delete(id));
  }

  imprimerFacture(id: bigint): Observable<any> {
      return this.http.get<any>(ENDPOINTS.FACTURE.imprimer(id), { headers: getHeadersPDF(), responseType: 'blob' as 'json' });
  }

  imprimerEtat(facturePrintRequest: FacturePrintRequest): Observable<any> {
      return this.http.post<any>(ENDPOINTS.FACTURE.imprimerEtat, facturePrintRequest, { headers: getHeadersPDF(), responseType: 'blob' as 'json' });
  }

  serialization(obj: FactureRequest): any {
    return {
        ...obj,
    };
  }
  
}
