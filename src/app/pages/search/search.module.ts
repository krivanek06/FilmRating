import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import { FilmCardsContainerComponent } from './components/film-cards-container/film-cards-container.component';
import { FilterContainerComponent } from './components/filter-container/filter-container.component';


const routes: Routes = [
  {
    path: '',
    component: SearchComponent
  },
];
@NgModule({
  declarations: [SearchComponent, FilmCardsContainerComponent, FilterContainerComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class SearchModule { }
