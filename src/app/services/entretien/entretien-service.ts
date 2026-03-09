import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from 'src/app/config/endpoints';
import { Entretien } from 'src/app/models/entretien';
import { getHeadersPDF } from '@/shared/classes/generic-methods';
import { CommonSearchModel } from '@/search/common-search-model';

@Injectable({
    providedIn: 'root'
})
export class EntretienService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<Entretien[]> {
        return this.http.get<Entretien[]>(ENDPOINTS.ENTRETIEN.getAll);
    }

    getById(id: bigint): Observable<Entretien> {
        return this.http.get<Entretien>(ENDPOINTS.ENTRETIEN.getById(id));
    }

    create(entretien: Entretien): Observable<Entretien> {
        return this.http.post<Entretien>(ENDPOINTS.ENTRETIEN.create, entretien);
    }

    update(id: bigint, entretien: Entretien): Observable<Entretien> {
        return this.http.patch<Entretien>(ENDPOINTS.ENTRETIEN.update(id), entretien);
    }

    delete(id: bigint): Observable<void> {
        return this.http.delete<void>(ENDPOINTS.ENTRETIEN.delete(id));
    }

    exist(entretien: Entretien): Observable<boolean> {
        return this.http.post<boolean>(ENDPOINTS.ENTRETIEN.exist, entretien);
    }

    search(commonSearchModel: CommonSearchModel): Observable<Entretien[]> {
        return this.http.post<Entretien[]>(ENDPOINTS.ENTRETIEN.search, commonSearchModel);
    }

    imprimer(entretien: Entretien): Observable<any> {
        return this.http.post<any>(ENDPOINTS.ENTRETIEN.imprimer, entretien, { headers: getHeadersPDF(), responseType: 'blob' as 'json' });
    }
}
