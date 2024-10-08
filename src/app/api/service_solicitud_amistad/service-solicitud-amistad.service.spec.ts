import { TestBed } from '@angular/core/testing';

import { ServiceSolicitudAmistadService } from './service-solicitud-amistad.service';

describe('ServiceSolicitudAmistadService', () => {
  let service: ServiceSolicitudAmistadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceSolicitudAmistadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
