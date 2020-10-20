import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FirebaseMovieDetailReview, FirebaseMovieDetailRating, FirebaseMovieDetails} from '../components/comment-section/models/comment-section.model';
import {Observable} from 'rxjs';
import {AuthService} from '../../../shared/services/auth.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieDetailsService {
  MOVIE_DETAILS_COLLECTION = 'movie_details';
  MOVIE_REVIEW_COLLECTION = 'movie_review';

  constructor(private angularFirestore: AngularFirestore) {
  }

  getMovieDetails(movieId: string): Observable<FirebaseMovieDetails> {
    return this.angularFirestore
      .collection(this.MOVIE_DETAILS_COLLECTION)
      .doc<FirebaseMovieDetails>(movieId)
      .valueChanges();
  }

  geReviewsForMovie(movieId: string): Observable<FirebaseMovieDetailReview[]> {
    return this.angularFirestore
      .collection(this.MOVIE_DETAILS_COLLECTION)
      .doc(movieId)
      .collection<FirebaseMovieDetailReview>(this.MOVIE_REVIEW_COLLECTION)
      .snapshotChanges()
      .pipe(
        map(res => res.map(data => {
          const review: FirebaseMovieDetailReview = {
            ...data.payload.doc.data() as FirebaseMovieDetailReview,
            id: data.payload.doc.id
          };
          return review;
        }))
      );
  }



}
