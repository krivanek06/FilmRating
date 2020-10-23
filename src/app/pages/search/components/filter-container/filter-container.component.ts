import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {GenreTypes} from '../../../../api/film-data.model';
import {categorySort, CategorySort} from '../../models/filter.model';

@Component({
  selector: 'app-filter-container',
  templateUrl: './filter-container.component.html',
  styleUrls: ['./filter-container.component.scss']
})
export class FilterContainerComponent implements OnInit {
  @Output() selectedGenreTypesEmitter: EventEmitter<GenreTypes[]> = new EventEmitter<GenreTypes[]>();
  @Output() removeSelectedGenderType: EventEmitter<GenreTypes> = new EventEmitter<GenreTypes>();
  @Output() sortByEmitter: EventEmitter<CategorySort> = new EventEmitter<CategorySort>();

  @Input() genreTypes: GenreTypes[] = [];
  @Input() selectedGenreTypes: GenreTypes[] = [];
  @Input() sortBy: CategorySort;

  categorySort = categorySort;

  constructor() {
  }

  ngOnInit(): void {
    this.applyCustomClassToPopOver();
  }

  getValuesFromSelector(event: CustomEvent) {
    this.selectedGenreTypesEmitter.emit(event.detail.value);
  }

  changeSorting(event: CustomEvent) {
    this.sortByEmitter.emit(event.detail.value);
  }

  removeSelectedGender(selected: GenreTypes) {
    this.removeSelectedGenderType.emit(selected);
  }

  /**
   * add some styling to pop-up
   */
  private applyCustomClassToPopOver(): void {
    const selects = document.querySelectorAll('.custom-options');

    // add css class to pop-over
    for (let i = 0; i < selects.length; i++) {
      const interfaceOptions: any = selects[i];
      interfaceOptions.interfaceOptions = {
        cssClass: 'my-custom-alert-class'
      };
    }
  }
}
