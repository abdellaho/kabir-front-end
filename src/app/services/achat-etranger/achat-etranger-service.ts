import { ENDPOINTS } from '@/config/endpoints';
import { AchatEtranger } from '@/models/achat-etranger';
import { AchatEtrangerRequest } from '@/shared/classes/achat-etranger-request';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AchatEtrangerService {
    private readonly ENDPOINTS = ENDPOINTS.ACHAT_ETRANGER;
    constructor(private http: HttpClient) {}

    getAll(): Observable<AchatEtranger[]> {
        return this.http.get<AchatEtranger[]>(this.ENDPOINTS.getAll);
    }

    getById(id: bigint): Observable<AchatEtranger> {
        return this.http.get<AchatEtranger>(this.ENDPOINTS.getById(id));
    }

    getByIdRequest(id: bigint): Observable<AchatEtrangerRequest> {
        return this.http.get<AchatEtrangerRequest>(this.ENDPOINTS.getByIdRequest(id));
    }

    create(AchatEtrangerRequest: AchatEtrangerRequest): Observable<AchatEtranger> {
        return this.http.post<AchatEtranger>(this.ENDPOINTS.create, AchatEtrangerRequest);
    }

    update(id: bigint, AchatEtrangerRequest: AchatEtrangerRequest): Observable<AchatEtranger> {
        return this.http.patch<AchatEtranger>(this.ENDPOINTS.update(id), AchatEtrangerRequest);
    }

    delete(id: bigint): Observable<void> {
        return this.http.delete<void>(this.ENDPOINTS.delete(id));
    }

    search(AchatEtranger: AchatEtranger): Observable<AchatEtranger[]> {
        return this.http.post<AchatEtranger[]>(this.ENDPOINTS.search, AchatEtranger);
    }

    getLastNumAchat(AchatEtranger: AchatEtranger): Observable<number> {
        return this.http.post<number>(this.ENDPOINTS.getLastNumAchatEtranger, AchatEtranger);
    }

    exist(AchatEtranger: AchatEtranger): Observable<boolean> {
        return this.http.post<boolean>(this.ENDPOINTS.exist, AchatEtranger);
    }
}
