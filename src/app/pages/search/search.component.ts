import {Component, OnInit} from '@angular/core';
import {FilmDataService} from '../../api/film-data.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {DiscoveredMoviesWrapper, GenreTypes, MovieDetails} from '../../api/film-data.model';
import {ComponentBaseComponent} from '../../shared/components/component-base/component-base.component';
import {CategorySort} from './models/filter.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends ComponentBaseComponent implements OnInit {
  discoveredMovies$: Observable<DiscoveredMoviesWrapper>;
  genreTypes$: Observable<GenreTypes[]>;

  selectedGenreTypes: GenreTypes[] = [];    // user select what type of films want to watch -> action, comedy, etc.
  pageNumber = 1;                           // which page I am listing
  sortBy: CategorySort = {
    displayName: 'Popularity descending',
    sortName: 'popularity.desc'
  };

  constructor(private filmDataService: FilmDataService,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.getGenreIdFromQueryParam();

    this.searchMovies();

    this.genreTypes$ = this.filmDataService.getGenresTypes();
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

  private searchMovies() {
    this.discoveredMovies$ = this.filmDataService.discoverMovies(this.selectedGenreTypes, this.pageNumber, this.sortBy);
  }

  // TODO after chosing category from dashboard -> should apper in queryparam
  private getGenreIdFromQueryParam() {
    this.route.queryParamMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      const genresId = data.get('genresId');
      console.log(genresId);
    });
  }
}
