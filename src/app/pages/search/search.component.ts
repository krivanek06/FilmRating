import {Component, OnInit} from '@angular/core';
import {FilmDataService} from '../../api/film-data.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MovieDetails} from '../../api/film-data.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  movieDetails$: Observable<MovieDetails>;

  constructor(private filmDataService: FilmDataService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // try url http://localhost:4200/search?genresId=28 and check console
    // 28 - is action, you can get it from  this.filmDataService.getGenresTypes()
    this.movieDetails$ = this.route.queryParamMap.pipe(
      switchMap((data: any) => this.filmDataService.getMovieDetails(data.params.genresId))
    );


    // check result in console
    this.movieDetails$.subscribe(x => console.log(x));

    // TEST
    // this.filmDataService.getGenresTypes().subscribe(console.log);
    // this.filmDataService.discoverMovies([28], 1).subscribe(x => console.log(x))

    // TEST
    // this.filmDataService.getGenresTypes().subscribe(x => console.log(x));
  }

}
