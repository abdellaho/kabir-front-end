import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AchatSimple } from '../../models/achat-simple';
import { ENDPOINTS } from '../../config/endpoints';
import { AchatSimpleRequest } from '@/shared/classes/achat-simple-request';
import { getHeadersPDF } from '@/shared/classes/generic-methods';

@Injectable({
  providedIn: 'root'
})
export class AchatSimpleService {
  private readonly ENDPOINTS = ENDPOINTS.ACHAT_SIMPLE;
  constructor(private http: HttpClient) { }

  getAll(): Observable<AchatSimple[]> {
    return this.http.get<AchatSimple[]>(this.ENDPOINTS.getAll);
  }

  getById(id: bigint): Observable<AchatSimple> {
    return this.http.get<AchatSimple>(this.ENDPOINTS.getById(id));
  }

  getByIdRequest(id: bigint): Observable<AchatSimpleRequest> {
    return this.http.get<AchatSimpleRequest>(this.ENDPOINTS.getByIdRequest(id));
  }

  create(achatSimpleRequest: AchatSimpleRequest): Observable<AchatSimple> {
    return this.http.post<AchatSimple>(this.ENDPOINTS.create, achatSimpleRequest);
  }

  update(id: bigint, achatSimpleRequest: AchatSimpleRequest): Observable<AchatSimple> {
    return this.http.put<AchatSimple>(this.ENDPOINTS.update(id), achatSimpleRequest);
  }

  imprimer(achatSimple: AchatSimple): Observable<any> {
      return this.http.post<any>(this.ENDPOINTS.imprimer, achatSimple, { headers: getHeadersPDF(), responseType: 'blob' as 'json' });
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(this.ENDPOINTS.delete(id));
  }

  search(achatSimple: AchatSimple): Observable<AchatSimple[]> {
    return this.http.post<AchatSimple[]>(this.ENDPOINTS.search, achatSimple);
  }
}
