import {Pipe, PipeTransform} from '@angular/core';
import {FirebaseMovieDetailComment, FirebaseMovieDetailReview} from '../models/comment-section.model';

@Pipe({
  name: 'commentSorting'
})
export class CommentSortingPipe implements PipeTransform {

  transform(comments: FirebaseMovieDetailComment[]): unknown {
    return comments.sort((a, b) => a.timestamp - b.timestamp);
  }

}
