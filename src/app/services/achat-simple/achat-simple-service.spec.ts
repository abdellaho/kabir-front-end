import { TestBed } from '@angular/core/testing';

import { AchatSimpleService } from './achat-simple-service';

describe('AchatSimpleService', () => {
  let service: AchatSimpleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AchatSimpleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
