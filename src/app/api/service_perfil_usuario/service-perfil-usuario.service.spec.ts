import { TestBed } from '@angular/core/testing';

import { ServicePerfilUsuarioService } from './service-perfil-usuario.service';

describe('ServiceUsuarioService', () => {
  let service: ServicePerfilUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicePerfilUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
