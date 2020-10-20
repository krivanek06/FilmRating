import {Component, Input, OnInit} from '@angular/core';
import {MovieDetails} from '../../../../api/film-data.model';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  @Input() movieDetails: MovieDetails;

  constructor() { }

  ngOnInit(): void {
  }

}
