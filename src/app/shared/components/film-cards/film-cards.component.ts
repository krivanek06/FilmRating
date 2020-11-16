import {Component, Input, OnInit} from '@angular/core';
import {DiscoveredMovie, DiscoveredMoviePartialData} from '../../../api/film-data.model';
import {Router} from '@angular/router';

@Component({
    selector: 'app-film-cards',
    templateUrl: './film-cards.component.html',
    styleUrls: ['./film-cards.component.scss']
})
export class FilmCardsComponent implements OnInit {
    @Input() discoveredMovies: DiscoveredMoviePartialData[];

    constructor(private route: Router) {
    }

    ngOnInit(): void {
    }

    showDetails(movie: DiscoveredMoviePartialData) {
        this.route.navigate([`menu/details/${movie.id}`]);
    }

    showError(event: CustomEvent) {
        const target = event.target as any;
        target.src = 'assets/default-img.jpg';
    }
}
