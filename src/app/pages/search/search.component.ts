import {Component, OnInit} from '@angular/core';
import {FilmDataService} from '../../api/film-data.service';
import {ActivatedRoute} from '@angular/router';
import {filter, find, map, shareReplay, switchMap, takeUntil} from 'rxjs/operators';
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
