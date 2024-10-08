import { TestBed } from '@angular/core/testing';

import { ServiceTagService } from './service-tag.service';

describe('ServiceTagService', () => {
  let service: ServiceTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
