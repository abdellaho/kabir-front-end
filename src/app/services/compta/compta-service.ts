import { ENDPOINTS } from '@/config/endpoints';
import { Compta } from '@/models/compta';
import { ComptaRequest } from '@/shared/classes/requests/compta-request';
import { ComptaResponse } from '@/shared/classes/responses/compta-response';
import { ComptaSearch } from '@/shared/classes/search/compta-search';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ComptaService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<Compta[]> {
        return this.http.get<Compta[]>(ENDPOINTS.COMPTA.getAll);
    }

    getById(id: bigint): Observable<Compta> {
        return this.http.get<Compta>(ENDPOINTS.COMPTA.getById(id));
    }

    create(caisse: Compta): Observable<Compta> {
        return this.http.post<Compta>(ENDPOINTS.COMPTA.create, caisse);
    }

    update(id: bigint, caisse: Compta): Observable<Compta> {
        return this.http.patch<Compta>(ENDPOINTS.COMPTA.update(id), caisse);
    }

    delete(id: bigint): Observable<void> {
        return this.http.delete<void>(ENDPOINTS.COMPTA.delete(id));
    }

    exist(comptaSearch: ComptaSearch): Observable<boolean> {
        return this.http.post<boolean>(ENDPOINTS.COMPTA.exist, comptaSearch);
    }

    search(comptaSearch: ComptaSearch): Observable<Compta[]> {
        return this.http.post<Compta[]>(ENDPOINTS.COMPTA.search, comptaSearch);
    }

    getLast(): Observable<Compta> {
        return this.http.get<Compta>(ENDPOINTS.COMPTA.last);
    }

    getGlobalSums(comptaRequest: ComptaRequest): Observable<ComptaResponse> {
        return this.http.post<ComptaResponse>(ENDPOINTS.COMPTA.globalSums, comptaRequest);
    }
}
