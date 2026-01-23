import { ENDPOINTS } from '@/config/endpoints';
import { Cheque } from '@/models/cheque';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChequeService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<Cheque[]> {
        return this.http.get<Cheque[]>(ENDPOINTS.CHEQUE.getAll);
    }

    getById(id: bigint): Observable<Cheque> {
        return this.http.get<Cheque>(ENDPOINTS.CHEQUE.getById(id));
    }

    create(Cheque: Cheque): Observable<Cheque> {
        return this.http.post<Cheque>(ENDPOINTS.CHEQUE.create, Cheque);
    }

    update(id: bigint, Cheque: Cheque): Observable<Cheque> {
        return this.http.patch<Cheque>(ENDPOINTS.CHEQUE.update(id), Cheque);
    }

    delete(id: bigint): Observable<void> {
        return this.http.delete<void>(ENDPOINTS.CHEQUE.delete(id));
    }

    exist(Cheque: Cheque): Observable<boolean> {
        return this.http.post<boolean>(ENDPOINTS.CHEQUE.exist, Cheque);
    }

    search(Cheque: Cheque): Observable<Cheque[]> {
        return this.http.post<Cheque[]>(ENDPOINTS.CHEQUE.search, Cheque);
    }

    generateNumCheque(): Observable<number> {
        return this.http.get<number>(ENDPOINTS.CHEQUE.getLastNum);
    }
}
