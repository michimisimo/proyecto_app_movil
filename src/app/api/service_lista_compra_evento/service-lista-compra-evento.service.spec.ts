import { TestBed } from '@angular/core/testing';

import { ServiceListaCompraEventoService } from './service-lista-compra-evento.service';

describe('ServiceListaCompraEventoService', () => {
  let service: ServiceListaCompraEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceListaCompraEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
