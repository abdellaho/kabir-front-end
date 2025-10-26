import { ENDPOINTS } from '@/config/endpoints';
import { Fournisseur } from '@/models/fournisseur';
import { omit } from '@/shared/classes/generic-methods';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(ENDPOINTS.STOCK.getAll);
  }

  getById(id: bigint): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(ENDPOINTS.STOCK.getById(id));
  }

  create(fournisseur: Fournisseur): Observable<Fournisseur> {
    const serializedObj = this.serialization(fournisseur);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.post<Fournisseur>(ENDPOINTS.STOCK.create, obj);
  }

  update(id: bigint, fournisseur: Fournisseur): Observable<Fournisseur> {
    const serializedObj = this.serialization(fournisseur);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.patch<Fournisseur>(ENDPOINTS.STOCK.update(id), obj);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.STOCK.delete(id));
  }

  exist(fournisseur: Fournisseur): Observable<boolean> {
    const serializedObj = this.serialization(fournisseur);
    return this.http.put<boolean>(ENDPOINTS.STOCK.search, serializedObj);
  }

  serialization(obj: Fournisseur): any {
    return {
      ...obj,
      id: obj.id?.toString(),
    };
  }
  
}
