import {Component, OnInit, ViewChild} from '@angular/core';
import {FilmDataService} from '../../api/film-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap, takeUntil, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MovieDetails, MovieImages, MovieTrailer} from '../../api/film-data.model';
import {MovieDetailsService} from './services/movie-details.service';
import {FirebaseMovieDetailReview, FirebaseMovieDetails} from './components/comment-section/models/comment-section.model';
import {ComponentBaseComponent} from '../../shared/components/component-base/component-base.component';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent extends ComponentBaseComponent implements OnInit {
  movieId: string;
  movieDetails$: Observable<MovieDetails>;
  firebaseMovieDetails$: Observable<FirebaseMovieDetails>;
  firebaseMovieReviews$: Observable<FirebaseMovieDetailReview[]>;

  constructor(private filmDataService: FilmDataService,
              private movieDetailsService: MovieDetailsService,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe((data: any) => {
      this.movieId = data.params.id;

      this.movieDetails$ = this.filmDataService.getMovieDetails(data.params.id);  // api call for movie details

      // this.firebaseMovieDetails$ = this.movieDetailsService.getMovieDetails(data.params.id);  // our data, currently empty
      this.firebaseMovieReviews$ = this.movieDetailsService.geReviewsForMovie(data.params.id);  // user reviews
    });
  }
}
