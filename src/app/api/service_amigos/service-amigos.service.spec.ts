import { TestBed } from '@angular/core/testing';

import { ServiceAmigosService } from './service-amigos.service';

describe('ServiceAmigosService', () => {
  let service: ServiceAmigosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceAmigosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
