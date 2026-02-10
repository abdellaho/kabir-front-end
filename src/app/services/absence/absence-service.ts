import { ENDPOINTS } from '@/config/endpoints';
import { Absence } from '@/models/absence';
import { CommonSearchModel } from '@/search/common-search-model';
import { getHeadersPDF, omit } from '@/shared/classes/generic-methods';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

    searchByCommon(commonSearchModel: CommonSearchModel): Observable<Absence[]> {
        return this.http.post<Absence[]>(ENDPOINTS.ABSENCE.searchByCommon, commonSearchModel);
    }

    getById(id: bigint): Observable<Absence> {
        return this.http.get<Absence>(ENDPOINTS.ABSENCE.getById(id));
    }

    create(absence: Absence): Observable<Absence> {
        const serializedObj = this.serialization(absence);
        const obj = omit(serializedObj, 'personnelOperation', 'personnel', 'dateAbsenceStr');
        return this.http.post<Absence>(ENDPOINTS.ABSENCE.create, obj);
    }

    update(id: bigint, absence: Absence): Observable<Absence> {
        const serializedObj = this.serialization(absence);
        const obj = omit(serializedObj, 'personnelOperation', 'personnel', 'dateAbsenceStr');
        return this.http.patch<Absence>(ENDPOINTS.ABSENCE.update(id), obj);
    }

    delete(id: bigint): Observable<void> {
        return this.http.delete<void>(ENDPOINTS.ABSENCE.delete(id));
    }

    exist(absence: Absence): Observable<boolean> {
        const serializedObj = this.serialization(absence);
        const obj = omit(serializedObj, 'personnelOperation', 'personnel', 'personnelOperationId', 'dateAbsenceStr');
        return this.http.post<boolean>(ENDPOINTS.ABSENCE.exist, obj);
    }

    imprimer(commonSearchModel: CommonSearchModel): Observable<any> {
        return this.http.post<any>(ENDPOINTS.ABSENCE.imprimer, commonSearchModel, { headers: getHeadersPDF(), responseType: 'blob' as 'json' });
    }

    serialization(obj: Absence): any {
        return {
            ...obj,
            id: obj.id?.toString()
        };
    }
}
