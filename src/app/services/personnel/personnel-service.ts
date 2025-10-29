import { ENDPOINTS } from '@/config/endpoints';
import { Personnel } from '@/models/personnel';
import { omit } from '@/shared/classes/generic-methods';
import { PersonnelSearch } from '@/shared/searchModels/personnel-search';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(ENDPOINTS.PERSONNEL.getAll);
  }

  getById(id: bigint): Observable<Personnel> {
    return this.http.get<Personnel>(ENDPOINTS.PERSONNEL.getById(id));
  }

  create(personnel: Personnel): Observable<Personnel> {
    const serializedObj = this.serialization(personnel);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.post<Personnel>(ENDPOINTS.PERSONNEL.create, obj);
  }

  update(id: bigint, personnel: Personnel): Observable<Personnel> {
    const serializedObj = this.serialization(personnel);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.patch<Personnel>(ENDPOINTS.PERSONNEL.update(id), obj);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.PERSONNEL.delete(id));
  }

  search(personnel: PersonnelSearch): Observable<boolean> {
    const serializedObj = this.serialization(personnel);
    const obj = omit(serializedObj, 'villeId', 'ville');
    return this.http.patch<boolean>(ENDPOINTS.PERSONNEL.search, obj);
  }

  serialization(obj: Personnel | PersonnelSearch): any {
    return {
      ...obj,
      id: obj.id?.toString(),
    };
  }
  
}
