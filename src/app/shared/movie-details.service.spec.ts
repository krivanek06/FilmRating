import { TestBed } from '@angular/core/testing';

import { MovieDetailsService } from './services/movie-details.service';

describe('MovieDetailsService', () => {
  let service: MovieDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
