import {Component, OnInit} from '@angular/core';
import {FilmDataService} from '../../api/film-data.service';
import {Observable} from 'rxjs';
import {DiscoveredMovie} from '../../api/film-data.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  filmDataService$: Observable<DiscoveredMovie[]>;

  constructor(private filmDataService: FilmDataService) {
  }

  ngOnInit(): void {
    // try url http://localhost:4200/dashboard

    // this.filmDataService.getGenresTypes();
    // this.filmDataService.getTrendingMovies();
    // this.filmDataService.getUpcomingMovies();
    this.filmDataService$ = this.filmDataService.getUpcomingMovies();
    this.filmDataService$.subscribe(console.log);
  }

}
