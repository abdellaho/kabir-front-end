import { TestBed } from '@angular/core/testing';

import { CompteCaisseService } from './compte-caisse-service';

describe('CompteCaisseService', () => {
  let service: CompteCaisseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompteCaisseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
