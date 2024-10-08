import { TestBed } from '@angular/core/testing';

import { ServiceInvitacionEventoService } from './service-invitacion-evento.service';

describe('ServiceInvitacionEventoService', () => {
  let service: ServiceInvitacionEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceInvitacionEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
