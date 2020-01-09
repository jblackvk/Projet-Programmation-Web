import { TestBed } from '@angular/core/testing';

import { CentralisationService } from './centralisation.service';

describe('CentralisationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CentralisationService = TestBed.get(CentralisationService);
    expect(service).toBeTruthy();
  });
});
