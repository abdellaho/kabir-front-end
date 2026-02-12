import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '@/config/endpoints';
import { StockDepot } from '@/models/stock-depot';
import { StockDepotRequest } from '@/shared/classes/stock-depot-request';
import { DetStockDepot } from '@/models/det-stock-depot';

@Injectable({
    providedIn: 'root'
})
export class StockDepotService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<StockDepot[]> {
        return this.http.get<StockDepot[]>(ENDPOINTS.STOCK_DEPOT.getAll);
    }

    getAllDetails(): Observable<DetStockDepot[]> {
        return this.http.get<DetStockDepot[]>(ENDPOINTS.STOCK_DEPOT.getAllDetails);
    }

    getById(id: bigint): Observable<StockDepot> {
        return this.http.get<StockDepot>(ENDPOINTS.STOCK_DEPOT.getById(id));
    }

    getByIdRequest(id: bigint): Observable<StockDepotRequest> {
        return this.http.get<StockDepotRequest>(ENDPOINTS.STOCK_DEPOT.getByIdRequest(id));
    }

    create(stockDepotRequest: StockDepotRequest): Observable<StockDepotRequest> {
        //const obj = this.serialization(stockDepotRequest);
        return this.http.post<StockDepotRequest>(ENDPOINTS.STOCK_DEPOT.create, stockDepotRequest);
    }

    update(id: bigint, stockDepotRequest: StockDepotRequest): Observable<StockDepotRequest> {
        //const obj = this.serialization(stockDepotRequest);
        return this.http.patch<StockDepotRequest>(ENDPOINTS.STOCK_DEPOT.update(id), stockDepotRequest);
    }

    delete(id: bigint): Observable<void> {
        return this.http.delete<void>(ENDPOINTS.STOCK_DEPOT.delete(id));
    }

    serialization(obj: StockDepotRequest): any {
        return {
            ...obj
        };
    }
}
