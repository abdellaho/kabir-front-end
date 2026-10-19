import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_MESSAGES } from '@/shared/classes/app-messages';
import { Erreur } from '@/shared/classes/erreur';
import { StateService } from '@/state/state-service';
import { httpErrorInterceptor } from './http-error.interceptor';

describe('httpErrorInterceptor - backend unreachable (FEATURE 8)', () => {
    let httpClient: HttpClient;
    let httpMock: HttpTestingController;
    let stateService: StateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(withInterceptors([httpErrorInterceptor])), provideHttpClientTesting()]
        });

        httpClient = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
        stateService = TestBed.inject(StateService);
        stateService.setState({ backendUnreachable: false, error: null });
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('status 0 sets backendUnreachable:true and overrides the Erreur message', () => {
        let received: Erreur | undefined;
        httpClient.get('/api/test').subscribe({ error: (e: Erreur) => (received = e) });

        httpMock.expectOne('/api/test').flush('network down', { status: 0, statusText: 'Unknown Error' });

        expect(stateService.getState().backendUnreachable).toBeTrue();
        expect(received).toBeDefined();
        expect(received!.status).toBe(0);
        // Re-thrown Erreur contract preserved, message replaced with the French banner text.
        expect(received!.message).toBe(APP_MESSAGES.messages.backendUnreachable);
    });

    it('status 500 leaves backendUnreachable:false, sets state error and rethrows the Erreur', () => {
        let received: Erreur | undefined;
        httpClient.get('/api/test').subscribe({ error: (e: Erreur) => (received = e) });

        httpMock.expectOne('/api/test').flush({ message: 'Server exploded' }, { status: 500, statusText: 'Server Error' });

        expect(stateService.getState().backendUnreachable).toBeFalse();
        expect(received).toBeDefined();
        expect(received!.status).toBe(500);
        expect(received!.message).toBe('Server exploded');
        expect(stateService.getState().error).toBe('Server exploded');
    });

    it('status 404 leaves backendUnreachable:false and rethrows the Erreur', () => {
        let received: Erreur | undefined;
        httpClient.get('/api/test').subscribe({ error: (e: Erreur) => (received = e) });

        httpMock.expectOne('/api/test').flush('not found', { status: 404, statusText: 'Not Found' });

        expect(stateService.getState().backendUnreachable).toBeFalse();
        expect(received).toBeDefined();
        expect(received!.status).toBe(404);
    });

    it('a successful response after an outage resets backendUnreachable to false', () => {
        httpClient.get('/api/outage').subscribe({ error: () => undefined });
        httpMock.expectOne('/api/outage').flush('boom', { status: 0, statusText: 'Unknown Error' });
        expect(stateService.getState().backendUnreachable).toBeTrue();

        httpClient.get('/api/recovered').subscribe();
        httpMock.expectOne('/api/recovered').flush({ ok: true }, { status: 200, statusText: 'OK' });

        expect(stateService.getState().backendUnreachable).toBeFalse();
    });
});
