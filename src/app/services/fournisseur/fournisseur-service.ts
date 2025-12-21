import { ENDPOINTS } from '@/config/endpoints';
import { Fournisseur } from '@/models/fournisseur';
import { getTypeOperation, omit } from '@/shared/classes/generic-methods';
import { OperationType } from '@/shared/enums/operation-type';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(ENDPOINTS.FOURNISSEUR.getAll);
  }

  getById(id: bigint): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(ENDPOINTS.FOURNISSEUR.getById(id));
  }

  create(fournisseur: Fournisseur): Observable<Fournisseur> {
    const serializedObj = this.serialization(fournisseur);
    const obj = omit(serializedObj, 'ville');
    return this.http.post<Fournisseur>(ENDPOINTS.FOURNISSEUR.create, obj);
  }

  update(id: bigint, fournisseur: Fournisseur): Observable<Fournisseur> {
    const serializedObj = this.serialization(fournisseur);
    const obj = omit(serializedObj, 'ville');
    return this.http.patch<Fournisseur>(ENDPOINTS.FOURNISSEUR.update(id), obj);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.FOURNISSEUR.delete(id));
  }

  exist(fournisseur: Fournisseur): Observable<boolean> {
    const serializedObj = this.serialization(fournisseur);
    return this.http.post<boolean>(ENDPOINTS.FOURNISSEUR.exist, serializedObj);
  }

  updateNbrOperation(id: bigint, operationType: OperationType): Observable<void> {
    let nbrOperation: number = getTypeOperation(operationType);
    return this.http.patch<void>(ENDPOINTS.FOURNISSEUR.updateNbrOperation(id), { nbrOperation });
  }

  search(fournisseur: Fournisseur): Observable<Fournisseur[]> {
    const serializedObj = this.serialization(fournisseur);
    return this.http.post<Fournisseur[]>(ENDPOINTS.FOURNISSEUR.search, serializedObj);
  }

  serialization(obj: Fournisseur): any {
    return {
      ...obj,
      id: obj.id?.toString(),
    };
  }

}
