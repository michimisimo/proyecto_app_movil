import { TestBed } from '@angular/core/testing';

import { ServiceApiConfigService } from './service-api-config.service';

describe('ServiceApiConfigService', () => {
  let service: ServiceApiConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceApiConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
