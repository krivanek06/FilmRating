import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {
  @Output() addComment: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchPeopleByUsername: EventEmitter<string> = new EventEmitter<string>();

  @Input() mentionPeople: string[];
  @Input() comment: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  emitAddComment() {
    this.addComment.emit(this.comment);
    this.comment = '';
  }

  searchUserByUsername(name: string) {
    if (name.length <= 3) {
      return;
    }
    this.searchPeopleByUsername.emit(name);
  }
}
