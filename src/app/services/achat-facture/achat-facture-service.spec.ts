import { TestBed } from '@angular/core/testing';

import { AchatFactureService } from './achat-facture-service';

describe('AchatFactureService', () => {
  let service: AchatFactureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AchatFactureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
