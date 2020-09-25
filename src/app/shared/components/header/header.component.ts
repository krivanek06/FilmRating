import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs';
import {IUser} from '../../models/IUser.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$: Observable<IUser>;

  constructor(private auth: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.user$ = this.auth.getUser();
    this.user$.subscribe(console.log)
  }

  searchForMovie(data: CustomEvent) {
    console.log('data', data);
  }

  navigateLogin(type: string) {
    this.router.navigate([`login/${type}`]);
  }

  signOut() {
    this.auth.logout();
  }

}
