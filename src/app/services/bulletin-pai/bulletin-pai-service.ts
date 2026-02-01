import { ENDPOINTS } from '@/config/endpoints';
import { BulletinPai } from '@/models/bulletin-pai';
import { BulletinPaiResponse } from '@/shared/classes/responses/bulletin-pai-response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BulletinPaiService {

  private ENDPOINT = ENDPOINTS.BULLETIN_PAI;

  constructor(private http: HttpClient) { }

  getAll(): Observable<BulletinPai[]> {
    return this.http.get<BulletinPai[]>(this.ENDPOINT.getAll);
  }

  getById(id: bigint): Observable<BulletinPai> {
    return this.http.get<BulletinPai>(this.ENDPOINT.getById(id));
  }

  getByIdResponse(id: bigint): Observable<BulletinPaiResponse> {
    return this.http.get<BulletinPaiResponse>(this.ENDPOINT.getByIdResponse(id));
  }

  create(bulletinPaiResponse: BulletinPaiResponse): Observable<BulletinPaiResponse> {
    return this.http.post<BulletinPaiResponse>(this.ENDPOINT.create, bulletinPaiResponse);
  }

  update(id:bigint, bulletinPaiResponse: BulletinPaiResponse): Observable<BulletinPaiResponse> {
    return this.http.put<BulletinPaiResponse>(this.ENDPOINT.update(id), bulletinPaiResponse);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(this.ENDPOINT.delete(id));
  }

  exist(bulletinPai: BulletinPai): Observable<boolean> {
    return this.http.post<boolean>(this.ENDPOINT.exist, bulletinPai);
  }

  search(bulletinPai: BulletinPai): Observable<BulletinPai[]> {
    return this.http.post<BulletinPai[]>(this.ENDPOINT.search, bulletinPai);
  }

  getLastNum(): Observable<number> {
    return this.http.get<number>(this.ENDPOINT.getLastNum);
  }

  getDetails(bulletinPai: BulletinPai): Observable<BulletinPaiResponse> {
    return this.http.post<BulletinPaiResponse>(this.ENDPOINT.details, bulletinPai);
  }
}
