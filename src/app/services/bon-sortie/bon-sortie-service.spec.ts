import { TestBed } from '@angular/core/testing';

import { BonSortieService } from './bon-sortie-service';

describe('BonSortieService', () => {
  let service: BonSortieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonSortieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
