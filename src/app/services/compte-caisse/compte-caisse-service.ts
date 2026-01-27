import { ENDPOINTS } from '@/config/endpoints';
import { CompteCaisse } from '@/models/compte-caisse';
import { CompteCaisseSearch } from '@/shared/classes/search/compte-caisse-search';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CompteCaisseService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<CompteCaisse[]> {
        return this.http.get<CompteCaisse[]>(ENDPOINTS.COMPTE_CAISSE.getAll);
    }

    getById(id: bigint): Observable<CompteCaisse> {
        return this.http.get<CompteCaisse>(ENDPOINTS.COMPTE_CAISSE.getById(id));
    }

    create(caisse: CompteCaisse): Observable<CompteCaisse> {
        return this.http.post<CompteCaisse>(ENDPOINTS.COMPTE_CAISSE.create, caisse);
    }

    update(id: bigint, caisse: CompteCaisse): Observable<CompteCaisse> {
        return this.http.patch<CompteCaisse>(ENDPOINTS.COMPTE_CAISSE.update(id), caisse);
    }

    delete(id: bigint): Observable<void> {
        return this.http.delete<void>(ENDPOINTS.COMPTE_CAISSE.delete(id));
    }

    exist(caisse: CompteCaisse): Observable<boolean> {
        return this.http.post<boolean>(ENDPOINTS.COMPTE_CAISSE.exist, caisse);
    }

    search(search: CompteCaisseSearch): Observable<CompteCaisse[]> {
        return this.http.post<CompteCaisse[]>(ENDPOINTS.COMPTE_CAISSE.search, search);
    }
}
