import { TestBed } from '@angular/core/testing';

import { ServiceFotoEventoService } from './service-foto-evento.service';

describe('ServiceListaFotosEventoService', () => {
  let service: ServiceFotoEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceFotoEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
