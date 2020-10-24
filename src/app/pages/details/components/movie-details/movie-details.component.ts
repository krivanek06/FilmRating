import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MovieDetails} from '../../../../api/film-data.model';
import {FirebaseMovieDetailRating, FirebaseMovieDetailReview} from '../comment-section/models/comment-section.model';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit, OnChanges {
  @Input() movieDetails: MovieDetails;
  @Input() firebaseMovieReviews: FirebaseMovieDetailReview[];
  movieRatings: FirebaseMovieDetailRating[] = [];
  movieRatingsOverall: FirebaseMovieDetailRating[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.firebaseMovieReviews && changes.firebaseMovieReviews.currentValue) {
      const firebaseMovieReviews = changes.firebaseMovieReviews.currentValue as unknown as FirebaseMovieDetailReview[];

      const allRatings = [].concat(...firebaseMovieReviews.map(x => x.ratings));

      this.movieRatings = allRatings.filter(x => x.type !== 'Overall rating');
      this.movieRatingsOverall = allRatings.filter(x => x.type === 'Overall rating');

      // rename "overall rating" into "Satisfied"
      this.movieRatingsOverall = this.movieRatingsOverall.map(x => {
        return {...x, type: 'Satisfied'};
      });
    }
  }

}
