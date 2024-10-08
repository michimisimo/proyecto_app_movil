import { TestBed } from '@angular/core/testing';

import { ServiceEstadoService } from './service-estado.service';

describe('ServiceEstadoService', () => {
  let service: ServiceEstadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceEstadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
