import { TestBed } from '@angular/core/testing';

import { ServiceImageService } from './service-image.service';

describe('ServiceImageService', () => {
  let service: ServiceImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
