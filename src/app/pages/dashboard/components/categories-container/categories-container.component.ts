import {Component, Input, OnInit} from '@angular/core';
import {GenreTypes} from '../../../../api/film-data.model';

@Component({
  selector: 'app-categories-container',
  templateUrl: './categories-container.component.html',
  styleUrls: ['./categories-container.component.scss']
})
export class CategoriesContainerComponent implements OnInit {
  @Input() genreTypes: GenreTypes[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
