import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '@/config/endpoints';
import { StockDepot } from '@/models/stock-depot';

@Injectable({
  providedIn: 'root'
})
export class StockDepotService {

    constructor(private http: HttpClient) {}

    getAll(): Observable<StockDepot[]> {
        return this.http.get<StockDepot[]>(ENDPOINTS.STOCK_DEPOT.getAll);
    }

    getById(id: bigint): Observable<StockDepot> {
        return this.http.get<StockDepot>(ENDPOINTS.STOCK_DEPOT.getById(id));
    }

    create(ville: StockDepot): Observable<StockDepot> {
        const obj = this.serialization(ville);
        return this.http.post<StockDepot>(ENDPOINTS.STOCK_DEPOT.create, obj);
    }

    update(id: bigint, ville: StockDepot): Observable<StockDepot> {
        const obj = this.serialization(ville);
        return this.http.patch<StockDepot>(ENDPOINTS.STOCK_DEPOT.update(id), obj);
    }

    delete(id: bigint): Observable<void> {
        return this.http.delete<void>(ENDPOINTS.STOCK_DEPOT.delete(id));
    }

    serialization(obj: StockDepot): any {
        return {
            ...obj,
            id: obj.id?.toString(),
        };
    }

}
