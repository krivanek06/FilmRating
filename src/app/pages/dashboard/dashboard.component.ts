import {Component, OnInit} from '@angular/core';
import {FilmDataService} from '../../api/film-data.service';
import {Observable} from 'rxjs';
import {DiscoveredMovie, GenreTypes} from '../../api/film-data.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  trendingMovies$: Observable<DiscoveredMovie[]>;
  upcomingMovies$: Observable<DiscoveredMovie[]>;
  genreTypes$: Observable<GenreTypes[]>;
  constructor(private filmDataService: FilmDataService,
              private router: Router) {
  }

  ngOnInit(): void {
    // try url http://localhost:4200/dashboard

    // this.filmDataService.getGenresTypes();
    // this.filmDataService.getTrendingMovies();
    // this.filmDataService.getUpcomingMovies();
    this.upcomingMovies$ = this.filmDataService.getUpcomingMovies();
    this.trendingMovies$ = this.filmDataService.getTrendingMovies();
    this.genreTypes$ = this.filmDataService.getGenresTypes();
    // this.genreTypes$.subscribe(console.log);
  }
  redirectToSearch() {
    this.router.navigate([`menu/search`]);
  }

}
