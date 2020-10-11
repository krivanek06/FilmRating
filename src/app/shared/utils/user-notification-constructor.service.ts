import {Injectable} from '@angular/core';
import {IUserNotification, IUserNotificationType} from '../models/IUser.model';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationConstructorService {

  constructor() {
  }

  static constructIAddedReviewAction(movieName: string): IUserNotification {
    const message = `You added a review on movie  ${movieName}`;
    return this.constructIUserNotification(message, true, IUserNotificationType.informative);
  }

  static constructIAddedCommentOnReviewAction(reviewUser: string, movieName: string): IUserNotification {
    const message = `You commented ${reviewUser}'s review on movie  ${movieName}`;
    return this.constructIUserNotification(message, true, IUserNotificationType.informative);
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

  static constructSomebodyAddedCommentOnReviewAction(userName: string, movieName: string): IUserNotification {
    const message = `User ${userName} added a comment on your review for movie ${movieName}`;
    return this.constructIUserNotification(message, false, IUserNotificationType.informative);
  }

  static constructSomebodyAddedReviewAction(userName: string, movieName: string): IUserNotification {
    const message = `User ${userName} added a review for movie ${movieName}`;
    return this.constructIUserNotification(message, false, IUserNotificationType.informative);
  }

  private static constructIUserNotification(message: string, read: boolean, type: IUserNotificationType): IUserNotification {
    return {
      message,
      read,
      timestamp: new Date().getTime(),
      type
    };
  }

}
