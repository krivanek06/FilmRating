import {FirebaseMovieDetailReview, FirebaseMovieDetailRating, FirebaseMovieDetailComment} from '../models/comment-section.model';
import {IUser} from '../../../../shared/models/IUser.model';

export class MovieDetailConstructor {
  static ConstructReview(user: IUser, comment: string, ratings?: FirebaseMovieDetailRating[]): FirebaseMovieDetailReview {
    const review: FirebaseMovieDetailReview = {
      comment,
      person: user.displayName,
      ratings,
      timestamp: new Date().getTime(),
      likes: [],
      dislikes: [],
      comments: []
    };
    return review;
  }

  static ConstructComment(user: IUser, comment: string): FirebaseMovieDetailComment {
    const constructedComment: FirebaseMovieDetailComment = {
      id: `${Date.now()}_${user.uid}`,
      comment,
      person: user.displayName,
      timestamp: new Date().getTime(),
      likes: [],
      dislikes: []
    };
    return constructedComment;
  }
}


