import { TestBed, inject } from '@angular/core/testing';

import { SecureService } from './secure.service';

describe('SecureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecureService]
    });
  });

  it('should be created', inject([SecureService], (service: SecureService) => {
    expect(service).toBeTruthy();
  }));
});
