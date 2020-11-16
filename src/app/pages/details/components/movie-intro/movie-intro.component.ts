import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FilmDataService} from '../../../../api/film-data.service';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {MovieDetails, MovieImages} from '../../../../api/film-data.model';
import {FirebaseMovieDetailReview} from '../comment-section/models/comment-section.model';
import {IonicDialogService} from '../../../../shared/services/ionic-dialog.service';


@Component({
  selector: 'app-movie-intro',
  templateUrl: './movie-intro.component.html',
  styleUrls: ['./movie-intro.component.scss']
})
export class MovieIntroComponent implements OnInit, OnChanges {
  @Input() movieId: string;
  @Input() movieDetails: MovieDetails;
  @Input() firebaseMovieReviews: FirebaseMovieDetailReview[];

  movieImages$: Observable<MovieImages[]>;
  safeSrc: SafeResourceUrl;

  constructor(private filmDataService: FilmDataService,
              private ionicDialogService: IonicDialogService,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer) {
  }


  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.movieId && changes.movieId.currentValue) {

      this.movieId = changes.movieId.currentValue;
      this.movieImages$ = this.filmDataService.getMovieImages(Number(this.movieId));    // api call for movie images

      // load video from youtube based on movie trailer key
      this.filmDataService.getMovieTrailer(Number(this.movieId)).subscribe(res => {
        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${res.key}`);
      });
    }
  }

  async showImage(image: MovieImages) {
    await this.ionicDialogService.presentAlertImage(`https://image.tmdb.org/t/p/w500/${image.file_path}`);
  }
}
