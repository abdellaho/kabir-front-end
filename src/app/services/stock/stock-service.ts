import { ENDPOINTS } from '@/config/endpoints';
import { Stock } from '@/models/stock';
import { omit } from '@/shared/classes/generic-methods';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Stock[]> {
    return this.http.get<Stock[]>(ENDPOINTS.STOCK.getAll);
  }

  getById(id: bigint): Observable<Stock> {
    return this.http.get<Stock>(ENDPOINTS.STOCK.getById(id));
  }

  create(stock: Stock): Observable<Stock> {
    const serializedObj = this.serialization(stock);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.post<Stock>(ENDPOINTS.STOCK.create, obj);
  }

  update(id: bigint, stock: Stock): Observable<Stock> {
    const serializedObj = this.serialization(stock);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.patch<Stock>(ENDPOINTS.STOCK.update(id), obj);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.STOCK.delete(id));
  }

  exist(stock: Stock): Observable<boolean> {
    const serializedObj = this.serialization(stock);
    return this.http.put<boolean>(ENDPOINTS.STOCK.search, serializedObj);
  }

  serialization(obj: Stock): any {
    return {
      ...obj,
      id: obj.id?.toString(),
    };
  }
  
}
