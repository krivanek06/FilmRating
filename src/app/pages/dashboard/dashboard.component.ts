import {Component, OnInit} from '@angular/core';
import {FilmDataService} from '../../api/film-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private filmDataService: FilmDataService) {
  }

  ngOnInit(): void {
    // try url http://localhost:4200/dashboard

    // this.filmDataService.getGenresTypes();
    // this.filmDataService.getTrendingMovies();
    // this.filmDataService.getUpcomingMovies();
  }

}
