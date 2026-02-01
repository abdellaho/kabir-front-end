import { TestBed } from '@angular/core/testing';

import { BulletinPaiService } from './bulletin-pai-service';

describe('BulletinPaiService', () => {
  let service: BulletinPaiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulletinPaiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
