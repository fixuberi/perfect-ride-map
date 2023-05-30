/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StoreFacadeService } from './store-facade.service';

describe('Service: StoreFacade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreFacadeService]
    });
  });

  it('should ...', inject([StoreFacadeService], (service: StoreFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
