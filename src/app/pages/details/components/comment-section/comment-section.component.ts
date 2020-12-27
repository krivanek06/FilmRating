import {ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DiscoveredMoviePartialData, GenreTypes} from '../../../../api/film-data.model';
import {genreTypeRatingAll, requiredGenreTypeRating} from './models/comment-genres.data';
import {RangeRatingComponent} from '../../../../shared/components/range-rating/range-rating.component';
import {
  FirebaseMovieDetailReview,
  FirebaseMovieDetailRating,
  FirebaseMovieDetailComment
} from './models/comment-section.model';
import {AuthService} from '../../../../shared/services/auth.service';
import {IUser, IUserPartialData} from '../../../../shared/models/IUser.model';
import {forkJoin, Observable} from 'rxjs';
import {IonicDialogService} from '../../../../shared/services/ionic-dialog.service';
import {MovieReviewService} from '../../services/movie-review.service';
import {UserManagementService} from '../../../../shared/services/user-management.service';
import {NotificationConstructorService} from '../../../../shared/utils/notification-constructor.service';
import {MovieDetailConstructor} from './utils/CommentConstrctor';
import {concatAll, concatMap, mergeMap, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ComponentBaseComponent} from '../../../../shared/components/component-base/component-base.component';
import {Router} from '@angular/router';
import {MovieDetailsService} from '../../../../shared/services/movie-details.service';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent extends ComponentBaseComponent implements OnInit {
  @Input() movieId: string;
  @Input() movieName: string;
  @Input() partialData: DiscoveredMoviePartialData;
  @Input() genreTypes: GenreTypes[] = [];
  @Input() reviews: FirebaseMovieDetailReview[] = [];

  @ViewChildren(RangeRatingComponent) rangeSelectors: QueryList<RangeRatingComponent>;

  searchedUsers$: Observable<string[]>; // when typing @user then make call to firebase
  selectedCategories: string[] = []; // user may select another categories to rate
  requiredCategories: string[] = []; // user must rate these categories
  authenticatedUser$: Observable<IUser>;
  showReviewForm = false;

  genreTypeRatingAll = genreTypeRatingAll;

  constructor(private authService: AuthService,
              private movieReviewService: MovieReviewService,
              private userManagementService: UserManagementService,
              private router: Router,
              private movieDetailService: MovieDetailsService,
              private ionicDialog: IonicDialogService) {
    super();
  }

  ngOnInit(): void {
    this.applyCustomClassToPopOver();
    this.initRequiredCategorieToRateFilm();
    this.authenticatedUser$ = this.authService.getUser();
  }

  async addReview(review: string) {
    const ratings: FirebaseMovieDetailRating[] = this.rangeSelectors.map(x => {
      return {rate: x.value, type: x.name};
    });
    this.rangeSelectors.forEach(x => x.clearValue());
    await this.movieReviewService.addReviewForMovie(this.movieId, ratings, review);
    await this.ionicDialog.presentToast(`Review was successfully added`);

    this.toggleShowReview();

    this.movieDetailService.updateMovieRatings(this.movieId, ratings, this.partialData);

    if (!this.authService.IUser) {
      return;
    }

    await this.userManagementService.sendNotification(this.authService.IUser.uid, NotificationConstructorService.constructIAddedReviewAction(this.movieName, this.movieId));

    const notificationMentionedNameMessage = NotificationConstructorService.constructSomebodyMentionedMeInCommentAction(this.authService.IUser.displayName, this.movieName, this.movieId);
    const notificationAddedReviewMessage = NotificationConstructorService.constructSomebodyAddedReviewAction(this.authService.IUser.displayName, this.movieName, this.movieId);
    const promises = MovieDetailConstructor.findAllUsernameInString(review).map(async name => await this.userManagementService.getIUserByDisplayName(name));

    const mentionedUsersInText = (await Promise.all(promises)).filter(x => !!x); // @useraname in text

    forkJoin(
      mentionedUsersInText.map(user => this.userManagementService.sendNotification(user.uid, notificationMentionedNameMessage)),
      this.authService.IUser.usersFollowMe.map(user => this.userManagementService.sendNotification(user.uid, notificationAddedReviewMessage))
    ).pipe(takeUntil(this.destroy$)).subscribe();
  }

  async addCommentOnReview(comment: string, review: FirebaseMovieDetailReview) {
    await this.movieReviewService.addCommentForReview(this.movieId, review.id, comment);
    await this.ionicDialog.presentToast('Comment was added successfully');
    if (!this.authService.IUser) {
      return;
    }
    await this.userManagementService.sendNotification(this.authService.IUser.uid, NotificationConstructorService.constructIAddedCommentOnReviewAction(review.person.displayName, this.movieName, this.movieId));
    await this.userManagementService.sendNotification(review.person.uid, NotificationConstructorService.constructSomebodyAddedCommentOnReviewAction(this.authService.IUser.displayName, this.movieName, this.movieId));


    // notify mentioned users in comment or users who follow me
    const notificationMentionedName = NotificationConstructorService.constructSomebodyMentionedMeInCommentAction(this.authService.IUser.displayName, this.movieName, this.movieId);
    const notificationAddedComment = NotificationConstructorService.constructSomebodyIFollowAddedCommentOnReviewAction(this.authService.IUser.displayName, review.person.displayName, this.movieName, this.movieId);
    const promises = MovieDetailConstructor.findAllUsernameInString(comment).map(async name => await this.userManagementService.getIUserByDisplayName(name));

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

    if (!this.authService.IUser) {
      return;
    }

    // notify mentioned users in comment
    const notificationMentionedName = NotificationConstructorService.constructSomebodyMentionedMeInCommentAction(this.authService.IUser.displayName, this.movieName, this.movieId);
    const promises = MovieDetailConstructor.findAllUsernameInString(data.newComment).map(async name => await this.userManagementService.getIUserByDisplayName(name));

    const mentionedUsersInText = (await Promise.all(promises)).filter(x => !!x);

    forkJoin(
      mentionedUsersInText.map(user => this.userManagementService.sendNotification(user.uid, notificationMentionedName))
    ).pipe(takeUntil(this.destroy$)).subscribe();
  }

  async editReview(editedReview: string, review: FirebaseMovieDetailReview) {
    this.movieReviewService.editReview(this.movieId, review.id, editedReview);
    await this.ionicDialog.presentToast(`Review was successfully edited`);

    if (!this.authService.IUser) {
      return;
    }

    // notify mentioned users in editedReview
    const notificationMentionedName = NotificationConstructorService.constructSomebodyMentionedMeInCommentAction(this.authService.IUser.displayName, this.movieName, this.movieId);
    const promises = MovieDetailConstructor.findAllUsernameInString(editedReview).map(async name => await this.userManagementService.getIUserByDisplayName(name));

    const mentionedUsersInText = (await Promise.all(promises)).filter(x => !!x);

    forkJoin(
      mentionedUsersInText.map(user => this.userManagementService.sendNotification(user.uid, notificationMentionedName))
    ).pipe(takeUntil(this.destroy$)).subscribe();
  }

  async deleteReview(review: FirebaseMovieDetailReview) {
    const answer = await this.ionicDialog.presentAlertConfirm(`Do you really want to delete this review ?`);
    if (answer) {
      await this.movieReviewService.removeReview(this.movieId, review.id);
      await this.ionicDialog.presentToast('Review was deleted successfully');
    }
  }

  async toggleShowReview() {
    this.showReviewForm = !this.showReviewForm;
  }

  likeOrDislikeReview(review: FirebaseMovieDetailReview, likeComment: boolean) {
    this.movieReviewService.likeOrDislikeReview(this.movieId, review, this.authService.IUser, likeComment);
  }

  searchPeopleByUsername(usernamePrefix: string) {
    if (!this.authService.IUser) {
      return;
    }
    this.searchedUsers$ = this.userManagementService.getUsernameStartWithPrefix(usernamePrefix);
  }

  likeOrDislikeComment(comment: FirebaseMovieDetailComment, review: FirebaseMovieDetailReview, likeComment: boolean) {
    this.movieReviewService.likeOrDislikeCommentOnReview(this.movieId, review.id, comment, this.authService.IUser, likeComment);
  }

  async deleteComment(comment: FirebaseMovieDetailComment, review: FirebaseMovieDetailReview) {
    const answer = await this.ionicDialog.presentAlertConfirm(`Do you really want to delete this comment ?`);
    if (answer) {
      await this.movieReviewService.removeCommentFromReview(this.movieId, review.id, comment);
      await this.ionicDialog.presentToast('Comment was deleted successfully');
    }
  }

  async followPerson(person: IUserPartialData) {
    const response = await this.ionicDialog.presentAlertConfirm(`Do you wish to start following ${person.displayName} ? You will receive a notification each time when ${person.displayName} will write a review or comment.`);
    if (response) {
      const user = this.authService.IUser;
      const followedUser = await this.userManagementService.getIUserByDisplayName(person.displayName);

      await this.userManagementService.updateUser({...user, usersFollowI: [...user.usersFollowI, person]});
      await this.userManagementService.updateUser({...followedUser, usersFollowMe: [...followedUser.usersFollowMe, user]});
      await this.ionicDialog.presentToast(`You successfully started following ${person.displayName}`);
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
