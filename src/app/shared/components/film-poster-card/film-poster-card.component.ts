import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MovieDetails} from '../../../api/film-data.model';

@Component({
  selector: 'app-film-poster-card',
  templateUrl: './film-poster-card.component.html',
  styleUrls: ['./film-poster-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilmPosterCardComponent implements OnInit {
  @Input() movieDetails: MovieDetails;

  constructor() {
  }

  ngOnInit(): void {
  }

}
