import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {DiscoveredMoviesWrapper} from '../../../../api/film-data.model';

@Component({
  selector: 'app-film-cards-container',
  templateUrl: './film-cards-container.component.html',
  styleUrls: ['./film-cards-container.component.scss']
})
export class FilmCardsContainerComponent implements OnInit {
  @Output() changePageNumberEmitter: EventEmitter<number> = new EventEmitter<number>();

  @Input() discoveredMovies: DiscoveredMoviesWrapper;
  @Input() pageNumber;

  constructor() {
  }

  ngOnInit(): void {
  }

  previous() {
    if (this.pageNumber === 1) {
      return;
    }
    this.changePageNumberEmitter.emit(this.pageNumber - 1);
  }

  next() {
    this.changePageNumberEmitter.emit(this.pageNumber + 1);
  }
}
