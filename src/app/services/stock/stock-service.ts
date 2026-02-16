import { ENDPOINTS } from '@/config/endpoints';
import { Stock } from '@/models/stock';
import { getHeadersPDF, getTypeOperation, omit } from '@/shared/classes/generic-methods';
import { PrintRequest } from '@/shared/classes/requests/print-request';
import { OperationType } from '@/shared/enums/operation-type';
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
        const obj = omit(serializedObj, 'fournisseur', 'ville');
        return this.http.post<Stock>(ENDPOINTS.STOCK.create, obj);
    }

    search(stock: Stock): Observable<Stock[]> {
        const serializedObj = this.serialization(stock);
        const obj = omit(serializedObj, 'fournisseur', 'ville');
        return this.http.post<Stock[]>(ENDPOINTS.STOCK.search, obj);
    }

    update(id: bigint, stock: Stock): Observable<Stock> {
        const serializedObj = this.serialization(stock);
        const obj = omit(serializedObj, 'fournisseur', 'ville');
        return this.http.patch<Stock>(ENDPOINTS.STOCK.update(id), obj);
    }

    delete(id: bigint): Observable<void> {
        return this.http.delete<void>(ENDPOINTS.STOCK.delete(id));
    }

    exist(stock: Stock): Observable<boolean> {
        const serializedObj = this.serialization(stock);
        return this.http.post<boolean>(ENDPOINTS.STOCK.exist, serializedObj);
    }

    updateQteStock(id: bigint, qte: number, operationType: OperationType): Observable<void> {
        let typeOperation: number = getTypeOperation(operationType);
        return this.http.patch<void>(ENDPOINTS.STOCK.updateQteStock(id), { qte, typeOperation, uniteGratuite: 0 });
    }

    updateQteStockImport(id: bigint, qte: number, operationType: OperationType): Observable<void> {
        let typeOperation: number = getTypeOperation(operationType);
        return this.http.patch<void>(ENDPOINTS.STOCK.updateQteStockImport(id), { qte, typeOperation, uniteGratuite: 0 });
    }

    updateQteStockFacturer(id: bigint, qte: number, operationType: OperationType): Observable<void> {
        let typeOperation: number = getTypeOperation(operationType);
        return this.http.patch<void>(ENDPOINTS.STOCK.updateQteStockFacturer(id), { qte, typeOperation, uniteGratuite: 0 });
    }

    imprimer(printRequest: PrintRequest): Observable<any> {
        return this.http.post(ENDPOINTS.STOCK.imprimer, printRequest, { headers: getHeadersPDF(), responseType: 'blob' as 'json' });
    }

    serialization(obj: Stock): any {
        return {
            ...obj,
            id: obj.id?.toString(),
            fournisseurId: obj.fournisseurId?.toString()
        };
    }
}
