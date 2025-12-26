import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '@/config/endpoints';
import { StockDepot } from '@/models/stock-depot';
import { StockDepotRequest } from '@/shared/classes/stock-depot-request';

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

    getByIdRequest(id: bigint): Observable<StockDepotRequest> {
        return this.http.get<StockDepotRequest>(ENDPOINTS.STOCK_DEPOT.getByIdRequest(id));
    }

    create(stockDepotRequest: StockDepotRequest): Observable<StockDepot> {
        //const obj = this.serialization(stockDepotRequest);
        return this.http.post<StockDepot>(ENDPOINTS.STOCK_DEPOT.create, stockDepotRequest);
    }

    update(id: bigint, stockDepotRequest: StockDepotRequest): Observable<StockDepot> {
        //const obj = this.serialization(stockDepotRequest);
        return this.http.patch<StockDepot>(ENDPOINTS.STOCK_DEPOT.update(id), stockDepotRequest);
    }

    delete(id: bigint): Observable<void> {
        return this.http.delete<void>(ENDPOINTS.STOCK_DEPOT.delete(id));
    }

    serialization(obj: StockDepotRequest): any {
        return {
            ...obj,
        };
    }

}
