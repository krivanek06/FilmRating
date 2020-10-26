import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import {SharedModule} from '../../shared/shared.module';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import { CategoriesContainerComponent } from './components/categories-container/categories-container.component';



const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
];

@NgModule({
  declarations: [DashboardComponent, CategoriesContainerComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class DashboardModule { }
