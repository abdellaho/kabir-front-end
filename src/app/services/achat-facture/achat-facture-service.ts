import { AchatFacture } from '@/models/achat-facture';
import { AchatFactureRequest } from '@/shared/classes/achat-facture-request';
import { ENDPOINTS } from '../../config/endpoints';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AchatFactureService {

  
  private readonly ENDPOINTS = ENDPOINTS.ACHAT_FACTURE;
  constructor(private http: HttpClient) { }

  getAll(): Observable<AchatFacture[]> {
    return this.http.get<AchatFacture[]>(this.ENDPOINTS.getAll);
  }

  getById(id: bigint): Observable<AchatFacture> {
    return this.http.get<AchatFacture>(this.ENDPOINTS.getById(id));
  }

  getByIdRequest(id: bigint): Observable<AchatFactureRequest> {
    return this.http.get<AchatFactureRequest>(this.ENDPOINTS.getByIdRequest(id));
  }

  create(achatFactureRequest: AchatFactureRequest): Observable<AchatFacture> {
    return this.http.post<AchatFacture>(this.ENDPOINTS.create, achatFactureRequest);
  }

  update(id: bigint, achatFactureRequest: AchatFactureRequest): Observable<AchatFacture> {
    return this.http.put<AchatFacture>(this.ENDPOINTS.update(id), achatFactureRequest);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(this.ENDPOINTS.delete(id));
  }

  search(achatFacture: AchatFacture): Observable<AchatFacture[]> {
    return this.http.post<AchatFacture[]>(this.ENDPOINTS.search, achatFacture);
  }

  getLastNumAchat(achatFacture: AchatFacture): Observable<number> {
    return this.http.post<number>(this.ENDPOINTS.getLastNumAchatFacture, achatFacture);
  }

  exist(achatFacture: AchatFacture): Observable<boolean> {
    return this.http.post<boolean>(this.ENDPOINTS.exist, achatFacture);
  }
  
}
