import {Component, Input, OnInit} from '@angular/core';
import {DiscoveredMovie} from '../../../api/film-data.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-film-cards',
  templateUrl: './film-cards.component.html',
  styleUrls: ['./film-cards.component.scss']
})
export class FilmCardsComponent implements OnInit {
  @Input() discoveredMovies: DiscoveredMovie[];

  constructor(private route: Router) {
  }

  ngOnInit(): void {
  }

  showDetails(movie: DiscoveredMovie) {
    this.route.navigate([`menu/details/${movie.id}`]);
  }
}
