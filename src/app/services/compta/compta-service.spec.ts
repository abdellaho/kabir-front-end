import { TestBed } from '@angular/core/testing';

import { ComptaService } from './compta-service';

describe('ComptaService', () => {
    let service: ComptaService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ComptaService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
