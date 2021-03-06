import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject, Observable} from 'rxjs';
import {
  FirebaseMovieDetailRating,
  FirebaseMovieDetailRatingAverage,
  FirebaseMovieDetails, joinName
} from '../../pages/details/components/comment-section/models/comment-section.model';
import {DiscoveredMovie, DiscoveredMoviePartialData} from '../../api/film-data.model';
import {CollectionReference} from '@angular/fire/firestore/interfaces';
import {Query, QueryFn} from '@angular/fire/firestore';
import {filter, map} from 'rxjs/operators';
import {FriendSorting} from '../models/IUser.model';

@Injectable({
  providedIn: 'root'
})
export class MovieDetailsService {
  private firebaseMovies$: BehaviorSubject<FirebaseMovieDetails[]> = new BehaviorSubject<FirebaseMovieDetails[]>([]);
  sortByFriendCash: FriendSorting[] = [];
  MOVIE_DETAILS_COLLECTION = 'movie_details';

  constructor(private angularFirestore: AngularFirestore) {
    this.angularFirestore.collection(this.MOVIE_DETAILS_COLLECTION).get()
      .pipe(map(r => r.docs.map(x => x.data()))).subscribe(res => {
      console.log('netowrk call');
      this.firebaseMovies$.next(res);
    });
  }

  getMovieDetails(movieId: string): Observable<FirebaseMovieDetails> {
    return this.angularFirestore
      .collection(this.MOVIE_DETAILS_COLLECTION)
      .doc<FirebaseMovieDetails>(movieId)
      .valueChanges();
  }

  searchMoviesByRatings(ratings: FirebaseMovieDetailRating[]): Observable<FirebaseMovieDetails[]> {
    return this.firebaseMovies$.asObservable();
  }

  get searchMovies(): FirebaseMovieDetails[] {
    return this.firebaseMovies$.getValue();
  }

  set searchMovies(movies: FirebaseMovieDetails[]) {
    this.firebaseMovies$.next(movies);
  }


  async updateMovieRatings(movieId: string, ratings: FirebaseMovieDetailRating[], movieData: DiscoveredMoviePartialData): Promise<void> {
    // load old average data
    const document = await this.angularFirestore
      .collection(this.MOVIE_DETAILS_COLLECTION)
      .doc<FirebaseMovieDetails>(movieId).get().toPromise();

    const details = document.data() as FirebaseMovieDetails;

    // create updated rating
    const updatedAverageRatings: FirebaseMovieDetailRatingAverage[] = ratings.map(rating => {
      const firebaseRating = !!details && !!details.averageRatings ? details.averageRatings.find(x => x.type === rating.type) : null;
      return {
        type: rating.type,
        rate: !!firebaseRating ? (firebaseRating.rate * firebaseRating.numberOfUsers + rating.rate) / (firebaseRating.numberOfUsers + 1) : rating.rate,
        numberOfUsers: !!firebaseRating ? firebaseRating.numberOfUsers + 1 : 1
      } as FirebaseMovieDetailRatingAverage;
    });

    // create final model
    const updatedDetails: FirebaseMovieDetails = {
      ...details,
      averageRatings: updatedAverageRatings,
      movieData: {
        id: movieData.id,
        poster_path: movieData.poster_path,
        title: movieData.title,
        vote_average: movieData.vote_average
      }
    };

    const filteredMovies = this.searchMovies.filter(x => x.movieData.id !== movieData.id);
    this.searchMovies = [updatedDetails, ...filteredMovies];

    // add average ratings as attributes for future filtering
    updatedAverageRatings.forEach(x => {
      updatedDetails[joinName(x.type)] = x.rate;
    });


    // save new data
    await this.angularFirestore
      .collection(this.MOVIE_DETAILS_COLLECTION)
      .doc<FirebaseMovieDetails>(movieId).set(updatedDetails, {merge: true});

  }
}
