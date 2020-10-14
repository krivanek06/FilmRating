import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs';
import {IUser, IUserNotification} from '../../models/IUser.model';
import {Router} from '@angular/router';
import {filter, flatMap, map, reduce, scan, tap} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$: Observable<IUser>;
  unreadNotifications$: Observable<number>;

  constructor(private auth: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.user$ = this.auth.getUser();

    // sum up unread notifications
    this.unreadNotifications$ = this.auth.getUser().pipe(
      filter(user => !!user),
      map(user => user.notifications
        .filter(x => !x.read)
        .reduce((acc, one: IUserNotification) => acc + 1, 0))
    );
  }

  searchForMovie(data: CustomEvent) {
    console.log('data', data);
  }

  navigateLogin(type: string) {
    this.router.navigate([`authentication/${type}`]);
  }

  signOut() {
    this.auth.logout();
  }

  redirectToProfile() {
    this.router.navigate([`menu/profile`]);
  }

}
