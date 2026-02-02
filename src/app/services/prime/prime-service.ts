import { ENDPOINTS } from '@/config/endpoints';
import { Prime } from '@/models/prime';
import { omit } from '@/shared/classes/generic-methods';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PrimeService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<Prime[]> {
        return this.http.get<Prime[]>(ENDPOINTS.PRIME.getAll);
    }

    getById(id: bigint): Observable<Prime> {
        return this.http.get<Prime>(ENDPOINTS.PRIME.getById(id));
    }

    create(prime: Prime): Observable<Prime> {
        const serializedObj = this.serialization(prime);
        const obj = omit(serializedObj, 'villeId', 'ville');
        return this.http.post<Prime>(ENDPOINTS.PRIME.create, obj);
    }

    update(id: bigint, prime: Prime): Observable<Prime> {
        const serializedObj = this.serialization(prime);
        const obj = omit(serializedObj, 'villeId', 'ville');
        return this.http.patch<Prime>(ENDPOINTS.PRIME.update(id), obj);
    }

    exist(prime: Prime): Observable<boolean> {
        const serializedObj = this.serialization(prime);
        return this.http.patch<boolean>(ENDPOINTS.PRIME.search, serializedObj);
    }

    delete(id: bigint): Observable<void> {
        return this.http.delete<void>(ENDPOINTS.PRIME.delete(id));
    }

    searchMontant(prime: Prime): Observable<Prime[]> {
        return this.http.post<Prime[]>(ENDPOINTS.PRIME.searchMontant, prime);
    }

    serialization(obj: Prime): any {
        return {
            ...obj,
            id: obj.id?.toString()
        };
    }
}
