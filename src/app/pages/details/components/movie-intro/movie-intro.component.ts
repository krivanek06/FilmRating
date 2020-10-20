import {Component, Input, OnInit} from '@angular/core';
import {FilmDataService} from '../../../../api/film-data.service';
import {MovieDetailsService} from '../../services/movie-details.service';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {MovieDetails, MovieImages} from '../../../../api/film-data.model';
import {FirebaseMovieDetailReview, FirebaseMovieDetails} from '../comment-section/models/comment-section.model';
import {IonicDialogService} from '../../../../shared/services/ionic-dialog.service';


@Component({
  selector: 'app-movie-intro',
  templateUrl: './movie-intro.component.html',
  styleUrls: ['./movie-intro.component.scss']
})
export class MovieIntroComponent implements OnInit {
  @Input() movieId: string;
  @Input() movieDetails: MovieDetails;

  movieImages$: Observable<MovieImages[]>;
  firebaseMovieReviews$: Observable<FirebaseMovieDetailReview[]>;

  safeSrc: SafeResourceUrl;

  constructor(private filmDataService: FilmDataService,
              private movieDetailsService: MovieDetailsService,
              private ionicDialogService: IonicDialogService,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.movieImages$ = this.filmDataService.getMovieImages(Number(this.movieId));    // api call for movie images

    this.firebaseMovieReviews$ = this.movieDetailsService.geReviewsForMovie(this.movieId);  // user reviews

    // load video from youtube based on movie trailer key
    this.filmDataService.getMovieTrailer(Number(this.movieId)).subscribe(res => {
      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${res.key}`);
    });

  }

  async showImage(image: MovieImages) {
    await this.ionicDialogService.presentAlertImage(`https://image.tmdb.org/t/p/w500/${image.file_path}`);
  }
}
