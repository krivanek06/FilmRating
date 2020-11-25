import {Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {Observable} from 'rxjs';
import {GenreTypes} from '../../../../api/film-data.model';
import {categorySort, CategorySort} from '../../models/filter.model';
import {genreTypeRatingAll} from '../../../details/components/comment-section/models/comment-genres.data';
import {RangeRatingComponent} from '../../../../shared/components/range-rating/range-rating.component';
import {FirebaseMovieDetailRating} from '../../../details/components/comment-section/models/comment-section.model';
import {MovieDetailsService} from '../../../../shared/services/movie-details.service';

@Component({
    selector: 'app-filter-container',
    templateUrl: './filter-container.component.html',
    styleUrls: ['./filter-container.component.scss']
})
export class FilterContainerComponent implements OnInit {
    @Output() selectedGenreTypesEmitter: EventEmitter<GenreTypes[]> = new EventEmitter<GenreTypes[]>();
    @Output() removeSelectedGenderType: EventEmitter<GenreTypes> = new EventEmitter<GenreTypes>();
    @Output() sortByEmitter: EventEmitter<CategorySort> = new EventEmitter<CategorySort>();
    @Output() advanceSearchToggleEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() advanceSearchEmitter: EventEmitter<FirebaseMovieDetailRating[]> = new EventEmitter<FirebaseMovieDetailRating[]>();

    @Input() genreTypes: GenreTypes[] = [];
    @Input() selectedGenreTypes: GenreTypes[] = [];
    @Input() sortBy: CategorySort;
    @Input() advanceSearch;

    @ViewChildren(RangeRatingComponent) rangeSelectors: QueryList<RangeRatingComponent>;

    categorySort = categorySort;
    genreTypeRatingAll = genreTypeRatingAll;


    selectedCategoryNames: string[] = ['Overall rating']; // user may select another categories to rate
    selectedCategories: FirebaseMovieDetailRating[] = [{
        type: 'Overall rating',
        rate: 50
    }];

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


    getValuesFromRangeSelector(event: CustomEvent) {
        // got too much error if this was not here
        if (event.detail.value === this.selectedCategoryNames) {
            return;
        }
        const data = event.detail.value as string[];

        // save name & rates
        this.selectedCategories = data.map(type => {
            return {
                rate: this.selectedCategoryNames.includes(type) ? this.selectedCategories.find(s => s.type === type).rate : 50,
                type
            };
        });

        // save category names
        this.selectedCategoryNames = [...data];

    }

    toggleAdvanceSearch(event: CustomEvent) {
        const data = event.detail.value === 'Rating';
        this.advanceSearchToggleEmitter.emit(data);
        if (data) {
            this.filterBasedOnRangeSelector();
        }
    }

    changeRangeSelector(name: string, rate: number) {
        const item = this.selectedCategories.find(s => s.type === name);
        item.rate = rate;
    }

    filterBasedOnRangeSelector() {
        const ratings: FirebaseMovieDetailRating[] = this.rangeSelectors.map(x => {
            return {rate: x.value, type: x.name};
        });
        this.advanceSearchEmitter.emit(ratings);
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
