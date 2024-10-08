import { TestBed } from '@angular/core/testing';

import { ServiceCompraEventoService } from './service-compra-evento.service';

describe('ServiceCompraEventoService', () => {
  let service: ServiceCompraEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceCompraEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
