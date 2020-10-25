import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs';
import {IUser, IUserNotification} from '../../models/IUser.model';
import {Router} from '@angular/router';
import {filter, flatMap, map, reduce, scan, take, tap} from 'rxjs/operators';
import {FilmDataService} from '../../../api/film-data.service';
import {DiscoveredMoviesWrapper} from '../../../api/film-data.model';
import {IonSearchbar} from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$: Observable<IUser>;
  unreadNotifications$: Observable<number>;
  searchedMovies$: Observable<DiscoveredMoviesWrapper>;

  @ViewChildren('mySearchbar') searchBars: QueryList<IonSearchbar>;

  constructor(private auth: AuthService,
              private filmDataService: FilmDataService,
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
    if (!data.detail.value || data.detail.value.length <= 3) {
      return;
    }
    this.searchedMovies$ = this.filmDataService.searchMovieByName(data.detail.value);

  }

  signOut() {
    this.auth.logout();
  }

  redirectToLogin(type: string) {
    this.router.navigate([`authentication/${type}`]);
  }

  redirectToProfile() {
    this.router.navigate([`menu/profile`]);
  }

  redirectToDashboard() {
    this.router.navigate([`menu/dashboard`]);
  }

  redirectToDetails(movieId: number) {
    this.searchBars.forEach(searchbar => searchbar.value = null);
    this.searchedMovies$ = undefined;
    this.router.navigate([`menu/details/${movieId}`]);
  }

}
