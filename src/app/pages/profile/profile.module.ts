import { NgModule } from '@angular/core';
import {ProfileComponent} from './profile.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import { ListedUsersComponent } from './components/listed-users/listed-users.component';


const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  },
];


@NgModule({
  declarations: [
    ProfileComponent,
    ListedUsersComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ProfileModule { }
