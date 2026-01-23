import { TestBed } from '@angular/core/testing';

import { AchatEtrangerService } from './achat-etranger-service';

describe('AchatEtrangerService', () => {
  let service: AchatEtrangerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AchatEtrangerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
