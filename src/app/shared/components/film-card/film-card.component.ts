import {Component, Input, OnInit} from '@angular/core';
import {DiscoveredMovie} from '../../../api/film-data.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-film-card',
  templateUrl: './film-card.component.html',
  styleUrls: ['./film-card.component.scss']
})
export class FilmCardComponent implements OnInit {
  @Input() discoveredMovies: DiscoveredMovie[];

  constructor(private route: Router) {
  }

  ngOnInit(): void {
  }

  showDetails(movie: DiscoveredMovie) {
    this.route.navigate([`/details/${movie.id}`]);
  }
}
