import {NgModule} from '@angular/core';
import {DetailsComponent} from './details.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {CommentFormComponent} from './components/comment-section/comment-form/comment-form.component';
import {CommentSectionComponent} from './components/comment-section/comment-section.component';
import {CommentCardComponent} from './components/comment-section/comment-card/comment-card.component';
import {ReviewSortingPipe} from './components/comment-section/pipes/review-sorting.pipe';
import { CommentCardsComponent } from './components/comment-section/comment-cards/comment-cards.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { MovieIntroComponent } from './components/movie-intro/movie-intro.component';
import { CommentSortingPipe } from './components/comment-section/pipes/comment-sorting.pipe';

const routes: Routes = [
  {
    path: '',
    component: DetailsComponent
  },
];

@NgModule({
  declarations: [
    DetailsComponent,
    CommentFormComponent,
    CommentSectionComponent,
    CommentCardComponent,
    ReviewSortingPipe,
    CommentCardsComponent,
    MovieDetailsComponent,
    MovieIntroComponent,
    CommentSortingPipe,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class DetailsModule {
}
