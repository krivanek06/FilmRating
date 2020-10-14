import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {GenreTypes} from '../../../api/film-data.model';
import {genreTypeRatingAll, requiredGenreTypeRating} from './models/comment-genres.data';
import {RangeRatingComponent} from '../../../shared/components/range-rating/range-rating.component';
import {MovieDetailsService} from '../services/movie-details.service';
import {
  FirebaseMovieDetailReview,
  FirebaseMovieDetailRating,
  FirebaseMovieDetails,
  FirebaseMovieDetailComment
} from './models/comment-section.model';
import {AuthService} from '../../../shared/services/auth.service';
import {IUser} from '../../../shared/models/IUser.model';
import {forkJoin, Observable} from 'rxjs';
import {IonicDialogService} from '../../../shared/services/ionic-dialog.service';
import {MovieReviewService} from '../services/movie-review.service';
import {UserManagementService} from '../../../shared/services/user-management.service';
import {NotificationConstructorService} from '../../../shared/utils/notification-constructor.service';
import {MovieDetailConstructor} from './utils/CommentConstrctor';
import {concatAll, concatMap, mergeMap, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ComponentBaseComponent} from '../../../shared/components/component-base/component-base.component';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent extends ComponentBaseComponent implements OnInit {
  @Input() movieId: string;
  @Input() movieName: string;
  @Input() genreTypes: GenreTypes[] = [];
  @Input() reviews: FirebaseMovieDetailReview[] = [];

  @ViewChildren(RangeRatingComponent) rangeSelectors: QueryList<RangeRatingComponent>;

  searchedUsers$: Observable<string[]>; // when typing @user then make call to firebase
  selectedCategories: string[] = []; // user may select another categories to rate
  requiredCategories: string[] = []; // user must rate these categories
  authenticatedUser: IUser;

  genreTypeRatingAll = genreTypeRatingAll;

  constructor(private authService: AuthService,
              private movieReviewService: MovieReviewService,
              private userManagementService: UserManagementService,
              private ionicDialog: IonicDialogService) {
    super();
  }

  ngOnInit(): void {
    this.applyCustomClassToPopOver();
    this.initRequiredCategorieToRateFilm();
    this.authenticatedUser = this.authService.IUser;
  }

  async addReview(review: string) {
    const ratings: FirebaseMovieDetailRating[] = this.rangeSelectors.map(x => {
      return {rate: x.value, type: x.name};
    });
    this.rangeSelectors.forEach(x => x.clearValue());
    await this.movieReviewService.addReviewForMovie(this.movieId, ratings, review);
    await this.ionicDialog.presentToast(`Review was successfully added`);
    await this.userManagementService.sendNotification(this.authService.IUser.uid, NotificationConstructorService.constructIAddedReviewAction(this.movieName, this.movieId));

    const notificationMentionedName = NotificationConstructorService.constructSomebodyMentionedMeInCommentAction(this.authService.IUser.displayName, this.movieName, this.movieId);
    const notificationAddedReview = NotificationConstructorService.constructSomebodyAddedReviewAction(this.authService.IUser.displayName, this.movieName, this.movieId);
    const promises = MovieDetailConstructor.findAllUsernameInString(review).map(async name => await this.userManagementService.getIUserByUsername(name));

    const mentionedUsersInText = (await Promise.all(promises)).filter(x => !!x);

    forkJoin(
      mentionedUsersInText.map(user => this.userManagementService.sendNotification(user.uid, notificationMentionedName)),
      this.authService.IUser.usersFollowMe.map(user => this.userManagementService.sendNotification(user.uid, notificationAddedReview))
    ).pipe(takeUntil(this.destroy$)).subscribe();
  }

  async editReview(editedReview: string, review: FirebaseMovieDetailReview) {
    this.movieReviewService.editReview(this.movieId, review.id, editedReview);
    await this.ionicDialog.presentToast(`Review was successfully edited`);
  }

  async deleteReview(review: FirebaseMovieDetailReview) {
    const answer = await this.ionicDialog.presentAlertConfirm(`Do you really want to delete this review ?`);
    if (answer) {
      await this.movieReviewService.removeReview(this.movieId, review.id);
      await this.ionicDialog.presentToast('Review was deleted successfully');
    }
  }

  likeOrDislikeReview(review: FirebaseMovieDetailReview, likeComment: boolean) {
    this.movieReviewService.likeOrDislikeReview(this.movieId, review, this.authenticatedUser, likeComment);
  }

  searchPeopleByUsername(usernamePrefix: string) {
    this.searchedUsers$ = this.userManagementService.getUsernameStartWithPrefix(usernamePrefix);
  }

  async addCommentOnReview(comment: string, review: FirebaseMovieDetailReview) {
    await this.movieReviewService.addCommentForReview(this.movieId, review.id, comment);
    await this.ionicDialog.presentToast('Comment was added successfully');
    await this.userManagementService.sendNotification(this.authService.IUser.uid, NotificationConstructorService.constructIAddedCommentOnReviewAction(review.person.displayName, this.movieName, this.movieId));
    await this.userManagementService.sendNotification(review.person.uid, NotificationConstructorService.constructSomebodyAddedCommentOnReviewAction(this.authService.IUser.displayName, this.movieName, this.movieId));


    // notify mentioned users in comment or users who follow me
    const notificationMentionedName = NotificationConstructorService.constructSomebodyMentionedMeInCommentAction(this.authService.IUser.displayName, this.movieName, this.movieId);
    const notificationAddedComment = NotificationConstructorService.constructSomebodyIFollowAddedCommentOnReviewAction(this.authService.IUser.displayName, review.person.displayName, this.movieName, this.movieId);
    const promises = MovieDetailConstructor.findAllUsernameInString(comment).map(async name => await this.userManagementService.getIUserByUsername(name));

    const mentionedUsersInText = (await Promise.all(promises)).filter(x => !!x);
    forkJoin(
      mentionedUsersInText.map(user => this.userManagementService.sendNotification(user.uid, notificationMentionedName)),
      this.authService.IUser.usersFollowMe.map(user => this.userManagementService.sendNotification(user.uid, notificationAddedComment))
    ).pipe(takeUntil(this.destroy$)).subscribe();
  }

  async editComment(data: { oldComment: FirebaseMovieDetailComment, newComment: string }, review: FirebaseMovieDetailReview) {
    await this.movieReviewService.removeCommentFromReview(this.movieId, review.id, data.oldComment);
    await this.movieReviewService.persisCommentForReview(this.movieId, review.id, {...data.oldComment, comment: data.newComment});
    await this.ionicDialog.presentToast('Comment was edited successfully');
  }

  likeOrDislikeComment(comment: FirebaseMovieDetailComment, review: FirebaseMovieDetailReview, likeComment: boolean) {
    this.movieReviewService.likeOrDislikeCommentOnReview(this.movieId, review.id, comment, this.authenticatedUser, likeComment);
  }

  async deleteComment(comment: FirebaseMovieDetailComment, review: FirebaseMovieDetailReview) {
    const answer = await this.ionicDialog.presentAlertConfirm(`Do you really want to delete this comment ?`);
    if (answer) {
      await this.movieReviewService.removeCommentFromReview(this.movieId, review.id, comment);
      await this.ionicDialog.presentToast('Comment was deleted successfully');
    }
  }

  getValuesFromSelector(event: CustomEvent) {
    // got too much error if this was not here
    if (event.detail.value === this.selectedCategories) {
      return;
    }

    const unique = event.detail.value.filter(val => !this.requiredCategories.includes(val));
    this.selectedCategories = [...unique, ...this.requiredCategories];
  }

  private initRequiredCategorieToRateFilm(): void {
    const genderSpecificRating = [].concat.apply([], this.genreTypes.map(type => requiredGenreTypeRating[type.name]).filter((data: string[]) => data.length > 0));
    this.requiredCategories = [...genderSpecificRating, ...requiredGenreTypeRating.Required];
    this.selectedCategories = [...this.requiredCategories];
  }

  private applyCustomClassToPopOver(): void {
    const selects = document.querySelectorAll('.custom-options');

    // add css class to pop-over
    for (let i = 0; i < selects.length; i++) {
      const interfaceOptions: any = selects[i];
      interfaceOptions.interfaceOptions = {
        cssClass: 'my-custom-alert-class'
      };
    }
  }
}
