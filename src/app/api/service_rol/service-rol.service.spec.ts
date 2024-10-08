import { TestBed } from '@angular/core/testing';

import { ServiceRolService } from './service-rol.service';

describe('ServiceRolService', () => {
  let service: ServiceRolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceRolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
