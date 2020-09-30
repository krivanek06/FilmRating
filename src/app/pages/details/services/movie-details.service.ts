import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FirebaseMovieDetailComment, FirebaseMovieDetailRating, FirebaseMovieDetails} from '../comment-section/models/comment-section.model';
import {Observable} from 'rxjs';
import {firestore} from 'firebase/app';
import {IUser} from '../../../shared/models/IUser.model';
import {AuthService} from '../../../shared/services/auth.service';
import {CommentConstructor} from '../comment-section/utils/CommentConstrctor';

@Injectable({
  providedIn: 'root'
})
export class MovieDetailsService {
  MOVIE_DETAILS_COLLECTION = 'movie_details';

  constructor(private angularFirestore: AngularFirestore,
              private authService: AuthService) {
  }

  getMovieDetails(movieId: string): Observable<FirebaseMovieDetails> {
    return this.angularFirestore.collection(this.MOVIE_DETAILS_COLLECTION).doc<FirebaseMovieDetails>(movieId).valueChanges();
  }

  async addCommentForMovie(movieId: string, ratings: FirebaseMovieDetailRating[], comment: string) {
    const movieDetailComment = CommentConstructor.ConstructComment(this.authService.IUser, comment, ratings);
    await this.persisComment(movieId, movieDetailComment);
  }

  likeOrDislikeCommentOnMovie(movieId: string, comment: FirebaseMovieDetailComment, user: IUser, likeComment: boolean) {
    // remove old comment from array
    this.removeComment(movieId, comment);

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
        comment = {...comment, dislikes: comment.likes.filter(name => name !== user.displayName)}; // if it was disliked, remove
      } else {
        comment = {
          ...comment,
          dislikes: [...comment.dislikes, user.displayName],
          likes: [...comment.likes.filter(name => name !== user.displayName)]
        }; // was not disliked, add me and remove from likes
      }
    }

    this.persisComment(movieId, comment);
  }

  removeComment(movieId: string, comment: FirebaseMovieDetailComment): Promise<void> {
    return this.angularFirestore.collection(this.MOVIE_DETAILS_COLLECTION).doc(movieId).set({
      comments: firestore.FieldValue.arrayRemove(comment)
    }, {merge: true});
  }

  persisComment(movieId: string, comment: FirebaseMovieDetailComment): Promise<void> {
    return this.angularFirestore.collection(this.MOVIE_DETAILS_COLLECTION).doc(movieId).set({
      comments: firestore.FieldValue.arrayUnion(comment)
    }, {merge: true});
  }

}
