import {Injectable} from '@angular/core';
import {IUserNotification, IUserNotificationType} from '../models/IUser.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationConstructorService {

  constructor() {
  }

  static constructIAddedReviewAction(movieName: string, movieId: string): IUserNotification {
    const message = `You added a review on movie  ${movieName}`;
    return this.constructIUserNotification(message, true, IUserNotificationType.informative, movieId);
  }

  static constructIAddedCommentOnReviewAction(reviewUser: string, movieName: string, movieId: string): IUserNotification {
    const message = `You commented ${reviewUser}'s review on movie  ${movieName}`;
    return this.constructIUserNotification(message, true, IUserNotificationType.informative, movieId);
  }

  static constructIStartedFollowingSomebodyAction(userName: string): IUserNotification {
    const message = `You started following user:  ${userName}`;
    return this.constructIUserNotification(message, true, IUserNotificationType.informative);
  }

  static constructIStoppedFollowingSomebodyAction(userName: string): IUserNotification {
    const message = `You stopped following user:  ${userName}`;
    return this.constructIUserNotification(message, true, IUserNotificationType.informative);
  }

  static constructSomebodyStartedFollowingMeAction(userName: string): IUserNotification {
    const message = `User ${userName} started following you. He will get notified about all your future reviews.`;
    return this.constructIUserNotification(message, false, IUserNotificationType.informative);
  }

  static constructSomebodyMentionedMeInCommentAction(userName: string, movieName: string, movieId: string): IUserNotification {
    const message = `User ${userName} mentioned you in comment for movie: ${movieName}`;
    return this.constructIUserNotification(message, false, IUserNotificationType.informative, movieId);
  }

  static constructSomebodyAddedCommentOnReviewAction(userName: string, movieName: string, movieId: string): IUserNotification {
    const message = `User ${userName} added a comment on your review for movie ${movieName}`;
    return this.constructIUserNotification(message, false, IUserNotificationType.informative, movieId);
  }

  static constructSomebodyIFollowAddedCommentOnReviewAction(userName: string, userReview: string, movieName: string, movieId: string): IUserNotification {
    const message = `${userName} commented ${userReview}'s review for movie ${movieName}`;
    return this.constructIUserNotification(message, false, IUserNotificationType.informative, movieId);
  }

  static constructSomebodyAddedReviewAction(userName: string, movieName: string, movieId: string): IUserNotification {
    const message = `User ${userName} added a review for movie ${movieName}`;
    return this.constructIUserNotification(message, false, IUserNotificationType.informative, movieId);
  }

  private static constructIUserNotification(message: string, read: boolean, type: IUserNotificationType, movieId?: string): IUserNotification {
    return {
      message,
      read,
      timestamp: new Date().getTime(),
      type,
      movieId
    };
  }

}
