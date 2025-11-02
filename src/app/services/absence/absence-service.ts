import { ENDPOINTS } from '@/config/endpoints';
import { Absence } from '@/models/absence';
import { omit } from '@/shared/classes/generic-methods';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Absence[]> {
    return this.http.get<Absence[]>(ENDPOINTS.ABSENCE.getAll);
  }

  getById(id: bigint): Observable<Absence> {
    return this.http.get<Absence>(ENDPOINTS.ABSENCE.getById(id));
  }

  create(absence: Absence): Observable<Absence> {
    const serializedObj = this.serialization(absence);
    const obj = omit(serializedObj, 'personnelOperation', 'personnel');
    return this.http.post<Absence>(ENDPOINTS.ABSENCE.create, obj);
  }

  update(id: bigint, absence: Absence): Observable<Absence> {
    const serializedObj = this.serialization(absence);
    const obj = omit(serializedObj, 'personnelOperation', 'personnel');
    return this.http.patch<Absence>(ENDPOINTS.ABSENCE.update(id), obj);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.ABSENCE.delete(id));
  }

  exist(absence: Absence): Observable<boolean> {
    const serializedObj = this.serialization(absence);
    const obj = omit(serializedObj, 'personnelOperation', 'personnel', 'personnelOperationId');
    return this.http.post<boolean>(ENDPOINTS.ABSENCE.exist, obj);
  }

  serialization(obj: Absence): any {
    console.log(obj)
    return {
      ...obj,
      id: obj.id?.toString(),
    };
  }
  
}
