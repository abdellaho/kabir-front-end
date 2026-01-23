import { ENDPOINTS } from '@/config/endpoints';
import { Caisse } from '@/models/caisse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CaisseService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<Caisse[]> {
        return this.http.get<Caisse[]>(ENDPOINTS.CAISSE.getAll);
    }

    getById(id: bigint): Observable<Caisse> {
        return this.http.get<Caisse>(ENDPOINTS.CAISSE.getById(id));
    }

    create(caisse: Caisse): Observable<Caisse> {
        return this.http.post<Caisse>(ENDPOINTS.CAISSE.create, caisse);
    }

    update(id: bigint, caisse: Caisse): Observable<Caisse> {
        return this.http.patch<Caisse>(ENDPOINTS.CAISSE.update(id), caisse);
    }

    delete(id: bigint): Observable<void> {
        return this.http.delete<void>(ENDPOINTS.CAISSE.delete(id));
    }

    exist(caisse: Caisse): Observable<boolean> {
        return this.http.post<boolean>(ENDPOINTS.CAISSE.exist, caisse);
    }

    search(caisse: Caisse): Observable<Caisse[]> {
        return this.http.post<Caisse[]>(ENDPOINTS.CAISSE.search, caisse);
    }
}
