import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FirebaseMovieDetailComment} from '../models/comment-section.model';
import {IUser} from '../../../../shared/models/IUser.model';

@Component({
  selector: 'app-comment-cards',
  templateUrl: './comment-cards.component.html',
  styleUrls: ['./comment-cards.component.scss']
})
export class CommentCardsComponent implements OnInit {
  @Output() likeCommentEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() dislikeCommentEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() editCommentEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteCommentEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchPeopleByUsername: EventEmitter<string> = new EventEmitter<string>();

  @Input() comment: FirebaseMovieDetailComment;
  @Input() authenticatedUser: IUser;
  @Input() mentionPeople: string[];

  replayOnComment = false;

  constructor() {
  }

  ngOnInit(): void {
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

  replayToggle() {
    this.replayOnComment = !this.replayOnComment;
  }

  searchUserByUsername(name: string) {
    this.searchPeopleByUsername.emit(name);
  }

}
