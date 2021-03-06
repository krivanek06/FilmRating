import {Injectable} from '@angular/core';
import {
  FirebaseMovieDetailReview,
  FirebaseMovieDetailRating,
  FirebaseMovieDetailComment
} from '../components/comment-section/models/comment-section.model';
import {MovieDetailConstructor} from '../components/comment-section/utils/CommentConstrctor';
import {IUser} from '../../../shared/models/IUser.model';
import {firestore} from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../../shared/services/auth.service';
import {UserManagementService} from '../../../shared/services/user-management.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieReviewService {
  MOVIE_DETAILS_COLLECTION = 'movie_details';
  MOVIE_REVIEW_COLLECTION = 'movie_review';

  constructor(private angularFirestore: AngularFirestore,
              private userManagementService: UserManagementService,
              private authService: AuthService) {
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

  async addReviewForMovie(movieId: string, ratings: FirebaseMovieDetailRating[], review: string): Promise<void> {
    const movieDetailComment = MovieDetailConstructor.ConstructReview(this.authService.IUser, review, ratings);
    await this.angularFirestore.collection(this.MOVIE_DETAILS_COLLECTION)
      .doc(movieId)
      .collection(this.MOVIE_REVIEW_COLLECTION)
      .add(movieDetailComment);
  }

  async editReview(movieId: string, reviewId: string, editedReview: string): Promise<void> {
    await this.angularFirestore.collection(this.MOVIE_DETAILS_COLLECTION)
      .doc(movieId)
      .collection(this.MOVIE_REVIEW_COLLECTION)
      .doc(reviewId)
      .update({comment: editedReview});
  }

  async removeReview(movieId: string, reviewId: string): Promise<void> {
    await this.angularFirestore.collection(this.MOVIE_DETAILS_COLLECTION)
      .doc(movieId)
      .collection(this.MOVIE_REVIEW_COLLECTION)
      .doc(reviewId)
      .delete();
  }


  async likeOrDislikeReview(movieId: string, review: FirebaseMovieDetailReview, user: IUser, likeComment: boolean) {
    const points = this.determineAddingPoints(review, user, likeComment);
    if (likeComment) {
      if (review.likes.includes(user.displayName)) {
        review = {...review, likes: review.likes.filter(name => name !== user.displayName)}; // if it was liked, remove
      } else {
        review = {
          ...review,
          likes: [...review.likes, user.displayName],
          dislikes: [...review.dislikes.filter(name => name !== user.displayName)]
        }; // was not liked, add me and remove from dislikes
      }
    } else {
      // add dislike to the comment
      if (review.dislikes.includes(user.displayName)) {
        review = {...review, dislikes: review.likes.filter(name => name !== user.displayName)}; // if it was disliked, remove
      } else {
        review = {
          ...review,
          dislikes: [...review.dislikes, user.displayName],
          likes: [...review.likes.filter(name => name !== user.displayName)]
        }; // was not disliked, add me and remove from likes
      }
    }
    await this.angularFirestore.collection(this.MOVIE_DETAILS_COLLECTION)
      .doc(movieId)
      .collection(this.MOVIE_REVIEW_COLLECTION)
      .doc(review.id)
      .update(review);

    // add or subtract points for user
    if (!!review.person.uid) {
      this.userManagementService.addPointsToUser(review.person.uid, points);
    }
  }


  async addCommentForReview(movieId: string, reviewId: string, comment: string) {
    const movieDetailComment = MovieDetailConstructor.ConstructComment(this.authService.IUser, comment);
    await this.persisCommentForReview(movieId, reviewId, movieDetailComment);
  }

  likeOrDislikeCommentOnReview(movieId: string, reviewId: string, comment: FirebaseMovieDetailComment, user: IUser, likeComment: boolean) {
    // remove old comment from array
    this.removeCommentFromReview(movieId, reviewId, comment);

    // add like to the comment
    if (likeComment) {
      if (comment.likes.includes(user.displayName)) {
        comment = {...comment, likes: comment.likes.filter(name => name !== user.displayName)}; // if it was liked, remove
      } else {
        comment = {
          ...comment,
          likes: [...comment.likes, user.displayName],
          dislikes: [...comment.dislikes.filter(name => name !== user.displayName)]
        }; // was not liked, add me and remove from dislikes
      }
    } else {
      // add dislike to the comment
      if (comment.dislikes.includes(user.displayName)) {
        comment = {...comment, dislikes: comment.dislikes.filter(name => name !== user.displayName)}; // if it was disliked, remove
      } else {
        comment = {
          ...comment,
          dislikes: [...comment.dislikes, user.displayName],
          likes: [...comment.likes.filter(name => name !== user.displayName)]
        }; // was not disliked, add me and remove from likes
      }
    }

    this.persisCommentForReview(movieId, reviewId, comment);
  }

  removeCommentFromReview(movieId: string, reviewId: string, comment: FirebaseMovieDetailComment): Promise<void> {
    return this.angularFirestore.collection(this.MOVIE_DETAILS_COLLECTION)
      .doc(movieId)
      .collection(this.MOVIE_REVIEW_COLLECTION)
      .doc(reviewId)
      .set({comments: firestore.FieldValue.arrayRemove(comment)}, {merge: true});
  }

  persisCommentForReview(movieId: string, reviewId: string, comment: FirebaseMovieDetailComment): Promise<void> {
    return this.angularFirestore.collection(this.MOVIE_DETAILS_COLLECTION)
      .doc(movieId)
      .collection(this.MOVIE_REVIEW_COLLECTION)
      .doc(reviewId)
      .set({comments: firestore.FieldValue.arrayUnion(comment)}, {merge: true});
  }

  private determineAddingPoints(review: FirebaseMovieDetailReview, user: IUser, likeComment: boolean): number {
    let points = 0;
    if (likeComment) {
      points = review.likes.includes(user.displayName) ? -20 : review.dislikes.includes(user.displayName) ? 40 : 20;
    } else {
      points = review.dislikes.includes(user.displayName) ? +20 : review.likes.includes(user.displayName) ? -40 : -20;
    }
    return points;
  }
}
