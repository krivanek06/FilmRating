import {Component, OnInit} from '@angular/core';
import {FilmDataService} from '../../api/film-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap, takeUntil, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MovieDetails} from '../../api/film-data.model';
import {MovieDetailsService} from './services/movie-details.service';
import {FirebaseMovieDetailReview, FirebaseMovieDetails} from './comment-section/models/comment-section.model';
import {ComponentBaseComponent} from '../../shared/components/component-base/component-base.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent extends ComponentBaseComponent implements OnInit {
  movieId: string;
  filmDetails$: Observable<MovieDetails>;
  firebaseMovieDetails$: Observable<FirebaseMovieDetails>;
  firebaseMovieReviews$: Observable<FirebaseMovieDetailReview[]>;

  constructor(private filmDataService: FilmDataService,
              private movieDetailsService: MovieDetailsService,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    // TEST - try url http://localhost:4200/details/603 and check console
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe((data: any) => {
      this.movieId = data.params.id;
      this.filmDetails$ = this.filmDataService.getMovieDetails(data.params.id);
      this.firebaseMovieDetails$ = this.movieDetailsService.getMovieDetails(data.params.id);
      this.firebaseMovieReviews$ = this.movieDetailsService.geReviewsForMovie(data.params.id);
    });
  }

}
