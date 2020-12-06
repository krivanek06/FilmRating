import {FirebaseMovieDetailReview, FirebaseMovieDetailRating, FirebaseMovieDetailComment} from '../models/comment-section.model';
import {IUser} from '../../../../../shared/models/IUser.model';

export class MovieDetailConstructor {
  static ConstructReview(user: IUser, comment: string, ratings?: FirebaseMovieDetailRating[]): FirebaseMovieDetailReview {
    const review: FirebaseMovieDetailReview = {
      comment,
      person: {
        uid: user ? user.uid : null,
        displayName: user ? user.displayName : 'ANONYMOUS'
      },
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
      id: user.uid ?  `${Date.now()}_${user.uid}` : `${Date.now()}_ANONYMOUS`,
      comment,
      person: {
        uid: user ? user.uid : null,
        displayName: user ? user.displayName : 'ANONYMOUS'
      },
      timestamp: new Date().getTime(),
      likes: [],
      dislikes: []
    };
    return constructedComment;
  }

  /**
   * if message = 'Ahoj @Tomas123 ako sa mas' , then return ['Tomas123']
   */
  static findAllUsernameInString(message: string): string[] {
    return message.replace(/\s\s+/g, ' ').split(' ')
      .filter(messagePart => messagePart.startsWith('@'))
      .map(res => res.substr(1));
  }


}


