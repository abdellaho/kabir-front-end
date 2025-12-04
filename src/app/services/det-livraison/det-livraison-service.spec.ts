import { TestBed } from '@angular/core/testing';

import { DetLivraisonService } from './det-livraison-service';

describe('DetLivraisonService', () => {
  let service: DetLivraisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetLivraisonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
