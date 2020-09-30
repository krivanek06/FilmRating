import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {GenreTypes} from '../../../api/film-data.model';
import {genreTypeRatingAll, requiredGenreTypeRating} from './models/comment-genres.data';
import {RangeRatingComponent} from '../../../shared/components/range-rating/range-rating.component';
import {MovieDetailsService} from '../services/movie-details.service';
import {FirebaseMovieDetailComment, FirebaseMovieDetailRating, FirebaseMovieDetails} from './models/comment-section.model';
import {AuthService} from '../../../shared/services/auth.service';
import {IUser} from '../../../shared/models/IUser.model';
import {SearchFirebaseService} from '../../../shared/services/search-firebase.service';
import {Observable} from 'rxjs';
import {IonicDialogService} from '../../../shared/services/ionic-dialog.service';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent implements OnInit {
  @Input() movieId: string;
  @Input() genreTypes: GenreTypes[] = [];
  @Input() comments: FirebaseMovieDetailComment[] = [];

  @ViewChildren(RangeRatingComponent) rangeSelectors: QueryList<RangeRatingComponent>;

  searchedUsers$: Observable<string[]>; // when typing @user then make call to firebase
  selectedCategories: string[] = []; // user may select another categories to rate
  requiredCategories: string[] = []; // user must rate these categories
  authenticatedUser: IUser;

  genreTypeRatingAll = genreTypeRatingAll;

  constructor(private authService: AuthService,
              private searchFirebase: SearchFirebaseService,
              private movieDetailsService: MovieDetailsService,
              private ionicDialog: IonicDialogService) {
  }

  ngOnInit(): void {
    this.applyCustomClassToPopOver();
    this.initRequiredCategories();
    this.authenticatedUser = this.authService.IUser;
  }

  addComment(comment: string) {
    const ratings: FirebaseMovieDetailRating[] = this.rangeSelectors.map(x => {
      return {rate: x.value, type: x.name};
    });
    this.rangeSelectors.forEach(x => x.clearValue());
    this.movieDetailsService.addCommentForMovie(this.movieId, ratings, comment);
  }

  editComment(newCommentText: string, comment: FirebaseMovieDetailComment) {
    this.movieDetailsService.removeComment(this.movieId, comment);
    this.movieDetailsService.persisComment(this.movieId, {...comment, comment: newCommentText});
  }

  async deleteComment(comment: FirebaseMovieDetailComment) {
    const answer = await this.ionicDialog.presentAlertConfirm(`Do you really want to delete this comment ?`);
    if (answer) {
      await this.movieDetailsService.removeComment(this.movieId, comment);
      await this.ionicDialog.presentToast('Comment was deleted successfully');
    }
  }

  likeOrDislikeCommentOnMovie(comment: FirebaseMovieDetailComment, likeComment: boolean) {
    this.movieDetailsService.likeOrDislikeCommentOnMovie(this.movieId, comment, this.authenticatedUser, likeComment);
  }

  searchPeopleByUsername(usernamePrefix: string) {
    this.searchedUsers$ = this.searchFirebase.getUsernameStartWithPrefix(usernamePrefix);
  }

  getValuesFromSelector(event: CustomEvent) {
    // got too much error if this was not here
    if (event.detail.value === this.selectedCategories) {
      return;
    }

    const unique = event.detail.value.filter(val => !this.requiredCategories.includes(val));
    this.selectedCategories = [...unique, ...this.requiredCategories];
  }

  private initRequiredCategories(): void {
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
