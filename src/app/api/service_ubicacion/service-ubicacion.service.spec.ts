import { TestBed } from '@angular/core/testing';

import { ServiceUbicacionService } from './service-ubicacion.service';

describe('ServiceUbicacionService', () => {
  let service: ServiceUbicacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceUbicacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
