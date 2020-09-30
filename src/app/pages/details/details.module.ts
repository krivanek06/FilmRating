import {NgModule} from '@angular/core';
import {DetailsComponent} from './details.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {CommentFormComponent} from './comment-section/comment-form/comment-form.component';
import {CommentSectionComponent} from './comment-section/comment-section.component';
import {CommentCardComponent} from './comment-section/comment-card/comment-card.component';
import {CommentSortingPipe} from './comment-section/pipes/comment-sorting.pipe';
import { CommentCardsComponent } from './comment-section/comment-cards/comment-cards.component';

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
    CommentSortingPipe,
    CommentCardsComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class DetailsModule {
}
