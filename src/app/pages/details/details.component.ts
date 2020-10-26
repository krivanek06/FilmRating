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
  firebaseMovieReviews: FirebaseMovieDetailReview[];


  firebaseMovieDetails$: Observable<FirebaseMovieDetails>;


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

      this.movieDetails$ = this.filmDataService.getMovieDetails(data.params.id);

      this.movieDetailsService.geReviewsForMovie(this.movieId).pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.firebaseMovieReviews = res;
      });


      // this.firebaseMovieDetails$ = this.movieDetailsService.getMovieDetails(data.params.id);  // our data, currently empty
    });
  }
}
