import { TestBed } from '@angular/core/testing';

import { ServiceEventoTagService } from './service-evento-tag.service';

describe('ServiceEventoTagService', () => {
  let service: ServiceEventoTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceEventoTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
