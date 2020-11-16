import {Component, Input, OnInit} from '@angular/core';
import {GenreTypes} from '../../../../api/film-data.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-categories-container',
  templateUrl: './categories-container.component.html',
  styleUrls: ['./categories-container.component.scss']
})
export class CategoriesContainerComponent implements OnInit {
  @Input() genreTypes: GenreTypes[] = [];
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirectToSearch(genreID: number) {
    this.router.navigate([`menu/search`], {queryParams: {genreID}});
  }
}
