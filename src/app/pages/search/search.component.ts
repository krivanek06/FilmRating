import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FilmDataService} from '../../api/film-data.service';
import {ActivatedRoute} from '@angular/router';
import {filter, find, flatMap, map, shareReplay, switchMap, takeUntil, tap, toArray} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {DiscoveredMoviePartialData, DiscoveredMoviesWrapper, GenreTypes, MovieDetails} from '../../api/film-data.model';
import {ComponentBaseComponent} from '../../shared/components/component-base/component-base.component';
import {CategorySort} from './models/filter.model';
import {
  FirebaseMovieDetailRating,
  FirebaseMovieDetails,
  joinName
} from '../details/components/comment-section/models/comment-section.model';
import {MovieDetailsService} from '../../shared/services/movie-details.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends ComponentBaseComponent implements OnInit {
  discoveredMovies$: Observable<DiscoveredMoviesWrapper>;
  firebaseMovies$: Observable<DiscoveredMoviePartialData[]>;
  genreTypes$: Observable<GenreTypes[]>;

  selectedGenreTypes: GenreTypes[] = [];    // user select what type of films want to watch -> action, comedy, etc.
  pageNumber = 1;                           // which page I am listing
  sortBy: CategorySort = {
    displayName: 'Popularity descending',
    sortName: 'popularity.desc'
  };
  advanceSearchToggle = false;

  constructor(private filmDataService: FilmDataService,
              private movieDetailService: MovieDetailsService,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.genreTypes$ = this.filmDataService.getGenresTypes().pipe(shareReplay());
    this.getGenreIdFromQueryParam();
    this.searchMovies();
  }

  changePage(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.searchMovies();
  }

  filterByGenreTypes(genreTypes: GenreTypes[]) {
    this.selectedGenreTypes = genreTypes;
    this.searchMovies();
  }

  removeSelectedGenderType(genreTypes: GenreTypes) {
    this.selectedGenreTypes = this.selectedGenreTypes.filter(x => x !== genreTypes);
    this.searchMovies();
  }

  changeSorting(sortName: CategorySort) {
    this.sortBy = sortName;
    this.searchMovies();
  }

  advanceSearchToggleEmitter(toggle: boolean) {
    if (toggle === this.advanceSearchToggle) {
      return;
    }
    this.advanceSearchToggle = !this.advanceSearchToggle;
  }

  advanceSearchEmitter(data: FirebaseMovieDetailRating[]) {
    data = data.map(d => {
      return {type: joinName(d.type), rate: d.rate};
    });
    // console.log('advance search', data);

    this.firebaseMovies$ = this.movieDetailService.searchMoviesByRatings(data).pipe(
      flatMap(x => x),
      filter(x => {
        const a = data.map(e => x[e.type] > e.rate).includes(false);
        return !a;
      }),
      map(x => x.movieData),
      toArray()
    );
  }

  private searchMovies() {
    this.discoveredMovies$ = this.filmDataService.discoverMovies(this.selectedGenreTypes, this.pageNumber, this.sortBy);
  }


  private getGenreIdFromQueryParam() {
    this.route.queryParamMap.pipe(
      map(data => Number(data.get('genreID'))),
      filter(x => !!x),
      switchMap(id => this.genreTypes$.pipe(
        map(type => type.find(e => e.id === id))
      )),
      takeUntil(this.destroy$)
    ).subscribe(x => {
      this.selectedGenreTypes = [...this.selectedGenreTypes, x];
      this.searchMovies();
    });

  }
}
