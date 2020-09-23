import { NgModule } from '@angular/core';
import { DetailsComponent } from './details.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DetailsComponent
  },
];

@NgModule({
  declarations: [DetailsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class DetailsModule { }
