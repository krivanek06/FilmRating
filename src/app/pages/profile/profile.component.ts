import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Observable} from 'rxjs';
import {IUser, IUserPartialData} from '../../shared/models/IUser.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user$: Observable<IUser>;

  constructor(private auth: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.user$ = this.auth.getUser();
  }

  visitMovie(movieId: string) {
    this.router.navigate([`menu/details/${movieId}`]);
  }

  removeFollower(follower: IUserPartialData) {
    console.log(follower);
  }

  removeFollowedPerson(followed: IUserPartialData) {
    console.log(followed);
  }
}
