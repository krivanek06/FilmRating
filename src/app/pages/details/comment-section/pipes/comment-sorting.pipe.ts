import { Pipe, PipeTransform } from '@angular/core';
import {FirebaseMovieDetailReview} from '../models/comment-section.model';

@Pipe({
  name: 'commentSorting'
})
export class CommentSortingPipe implements PipeTransform {

  transform(comments: FirebaseMovieDetailReview[]): unknown {
    return comments.sort((a, b) => a.timestamp - b.timestamp);
  }

}
