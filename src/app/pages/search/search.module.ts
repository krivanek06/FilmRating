import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: SearchComponent
  },
];
@NgModule({
  declarations: [SearchComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class SearchModule { }
