import {FirebaseMovieDetailComment, FirebaseMovieDetailRating} from '../models/comment-section.model';
import {IUser} from '../../../../shared/models/IUser.model';

export class CommentConstructor {
  static ConstructComment(user: IUser, comment: string, ratings?: FirebaseMovieDetailRating[]): FirebaseMovieDetailComment {

    const movieDetailComment: FirebaseMovieDetailComment = {
      id: `${Date.now()}_${user.uid}`,
      comment,
      person: user.displayName,
      ratings,
      timestamp: new Date().getTime(),
      likes: [],
      dislikes: [],
      subComments: []
    };
    return movieDetailComment;
  }
}


