import { TestBed } from '@angular/core/testing';

import { ServiceEventoService } from './service-evento.service';

describe('ServiceEventoService', () => {
  let service: ServiceEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
