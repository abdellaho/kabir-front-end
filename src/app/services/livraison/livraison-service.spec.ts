import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ENDPOINTS } from '@/config/endpoints';
import { LivraisonService } from './livraison-service';

describe('LivraisonService (FEATURE 9 - numCheque + livrer)', () => {
    let service: LivraisonService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });
        service = TestBed.inject(LivraisonService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('imprimerParNumCheque posts the numCheque reference as a blob request', () => {
        let received: unknown;
        service.imprimerParNumCheque('123456').subscribe((data) => (received = data));

        const req = httpMock.expectOne(ENDPOINTS.LIVRAISON.imprimerNumCheque);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ numCheque: '123456' });
        expect(req.request.responseType).toBe('blob');

        const blob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
        req.flush(blob);

        expect(received instanceof Blob).toBeTrue();
    });

    it('livrer patches only the livrernonlivrer flag on the given livraison id', () => {
        let received: unknown;
        service.livrer(BigInt(5), 1).subscribe((data) => (received = data));

        const req = httpMock.expectOne(ENDPOINTS.LIVRAISON.livrer(BigInt(5)));
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual({ livrernonlivrer: 1 });

        req.flush({ id: '5', livrernonlivrer: 1 });

        expect(received).toEqual({ id: '5', livrernonlivrer: 1 } as any);
    });
});
