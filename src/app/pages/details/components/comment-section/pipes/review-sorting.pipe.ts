import {Pipe, PipeTransform} from '@angular/core';
import {FirebaseMovieDetailReview} from '../models/comment-section.model';

@Pipe({
  name: 'reviewSorting'
})
export class ReviewSortingPipe implements PipeTransform {
  /**
   * sort by number of likes, timestamp, dislikes
   * more likes higher comment,
   * more dislikes, lowe comment
   */
  transform(comments: FirebaseMovieDetailReview[]): unknown {
    return comments.sort((a, b) => {
      if (b.likes.length !== a.likes.length) {
        return b.likes.length - a.likes.length;
      } else {
        if (b.dislikes.length === a.dislikes.length) {
          return a.timestamp - b.timestamp;
        }
        return a.dislikes.length - b.dislikes.length;
      }
    });
  }

}
