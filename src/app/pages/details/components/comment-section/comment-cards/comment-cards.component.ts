import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FirebaseMovieDetailComment, FirebaseMovieDetailReview} from '../models/comment-section.model';
import {IUser} from '../../../../../shared/models/IUser.model';

@Component({
  selector: 'app-comment-cards',
  templateUrl: './comment-cards.component.html',
  styleUrls: ['./comment-cards.component.scss']
})
export class CommentCardsComponent implements OnInit {
  // review
  @Output() likeReviewEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() dislikeReviewEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() editReviewEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteReviewEmitter: EventEmitter<any> = new EventEmitter<any>();

  // comment
  @Output() addComment: EventEmitter<string> = new EventEmitter<string>();
  @Output() likeCommentEmitter: EventEmitter<FirebaseMovieDetailComment> = new EventEmitter<any>();
  @Output() dislikeCommentEmitter: EventEmitter<FirebaseMovieDetailComment> = new EventEmitter<FirebaseMovieDetailComment>();
  @Output() editCommentEmitter: EventEmitter<{oldComment: FirebaseMovieDetailComment, newComment: string}> = new EventEmitter<{oldComment: FirebaseMovieDetailComment, newComment: string}>();
  @Output() deleteCommentEmitter: EventEmitter<FirebaseMovieDetailComment> = new EventEmitter<FirebaseMovieDetailComment>();

  // search
  @Output() searchPeopleByUsername: EventEmitter<string> = new EventEmitter<string>();

  // inputs
  @Input() review: FirebaseMovieDetailReview;
  @Input() authenticatedUser: IUser;
  @Input() mentionPeople: string[];

  replayOnComment = false;

  constructor() {
  }

  ngOnInit(): void {
  }


  likeReview() {
    this.likeReviewEmitter.emit();
  }

  dislikeReview() {
    this.dislikeReviewEmitter.emit();
  }

  editReview(editedComment: string) {
    this.editReviewEmitter.emit(editedComment);
  }

  deleteReview() {
    this.deleteReviewEmitter.emit();
  }

  replayToggle() {
    this.replayOnComment = !this.replayOnComment;
  }

  searchUserByUsername(name: string) {
    this.searchPeopleByUsername.emit(name);
  }

  addSubComment(comment: string) {
    this.addComment.emit(comment);
  }

  deleteComment(comment: FirebaseMovieDetailComment) {
    this.deleteCommentEmitter.emit(comment);
  }

  editComment(editedComment: string, comment: FirebaseMovieDetailComment) {
    this.editCommentEmitter.emit({oldComment: comment, newComment: editedComment});
  }

  dislikeComment(comment: FirebaseMovieDetailComment) {
    this.dislikeCommentEmitter.emit(comment);
  }

  likeComment(comment: FirebaseMovieDetailComment) {
    this.likeCommentEmitter.emit(comment);
  }
}
