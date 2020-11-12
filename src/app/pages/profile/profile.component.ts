import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Observable} from 'rxjs';
import {IUser, IUserPartialData} from '../../shared/models/IUser.model';
import {Router} from '@angular/router';
import {IonicDialogService} from '../../shared/services/ionic-dialog.service';
import {UserManagementService} from '../../shared/services/user-management.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user$: Observable<IUser>;

  constructor(private auth: AuthService,
              private userManagementService: UserManagementService,
              private ionicDialog: IonicDialogService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.user$ = this.auth.getUser();
    this.readAllNotificationsAndRemoveOld();
  }

  visitMovie(movieId: string) {
    this.router.navigate([`menu/details/${movieId}`]);
  }

  async removeFollower(follower: IUserPartialData) {
    const answer = await this.ionicDialog.presentAlertConfirm(`Do you really want to remove ${follower.displayName} ?`);
    if (answer) {
      // remove myself from my follower
      const followedUser = await this.userManagementService.getIUserByDisplayName(follower.displayName);
      this.userManagementService.updateUser({
        ...followedUser,
        usersFollowI: followedUser.usersFollowI.filter(u => u.uid !== this.auth.IUser.uid)
      });

      // delete follower from myself
      await this.userManagementService.updateUser({
          ...this.auth.IUser,
          usersFollowMe: this.auth.IUser.usersFollowMe.filter(item => item.uid !== follower.uid)
        });
      await this.ionicDialog.presentToast(`${follower.displayName} don't follow you anymore`);
    }
  }

  async removeFollowedPerson(followed: IUserPartialData) {
    const answer = await this.ionicDialog.presentAlertConfirm(`Do you really want to remove ${followed.displayName} ?`);
    if (answer) {
      // remove myself from my follower
      const followedUser = await this.userManagementService.getIUserByDisplayName(followed.displayName);
      this.userManagementService.updateUser({
        ...followedUser,
        usersFollowMe: followedUser.usersFollowMe.filter(u => u.uid !== this.auth.IUser.uid)
      });

      // delete follower from myself
      await this.userManagementService.updateUser({
        ...this.auth.IUser,
        usersFollowI: this.auth.IUser.usersFollowI.filter(item => item.uid !== followed.uid)
      });
      await this.ionicDialog.presentToast(`You don't follow ${followed.displayName} anymore`);
    }
  }

  private readAllNotificationsAndRemoveOld() {
    const updatedNotifications = this.auth.IUser.notifications.map(notification => {
      return {...notification, read: true};
    }).reverse().splice(0, 8);
    this.userManagementService.updateUser({...this.auth.IUser, notifications: updatedNotifications});
  }
}
