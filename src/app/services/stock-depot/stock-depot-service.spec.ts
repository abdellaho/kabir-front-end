import { TestBed } from '@angular/core/testing';

import { StockDepotService } from './stock-depot-service';

describe('StockDepotService', () => {
  let service: StockDepotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockDepotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
