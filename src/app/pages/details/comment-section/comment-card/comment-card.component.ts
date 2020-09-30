import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FirebaseMovieDetailComment} from '../models/comment-section.model';
import {IUser} from '../../../../shared/models/IUser.model';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {
  @Output() likeCommentEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() dislikeCommentEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() editCommentEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteCommentEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() replayCommentEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchPeopleByUsername: EventEmitter<string> = new EventEmitter<string>();

  @Input() comment: FirebaseMovieDetailComment;
  @Input() authenticatedUser: IUser;
  @Input() mentionPeople: string[];

  editing = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleEditComment() {
    this.editing = !this.editing;
  }

  likeComment() {
    this.likeCommentEmitter.emit();
  }

  dislikeComment() {
    this.dislikeCommentEmitter.emit();
  }

  editComment(editedComment: string) {
    this.editCommentEmitter.emit(editedComment);
  }

  deleteComment() {
    this.deleteCommentEmitter.emit();
  }

  searchUserByUsername(name: string) {
    if (name.length <= 3) {
      return;
    }
    this.searchPeopleByUsername.emit(name);
  }

  replay() {
    this.replayCommentEmitter.emit();
  }
}
