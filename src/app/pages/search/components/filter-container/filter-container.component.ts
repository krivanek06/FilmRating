import {Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {Observable} from 'rxjs';
import {GenreTypes} from '../../../../api/film-data.model';
import {categorySort, CategorySort} from '../../models/filter.model';
import {genreTypeRatingAll} from '../../../details/components/comment-section/models/comment-genres.data';
import {RangeRatingComponent} from '../../../../shared/components/range-rating/range-rating.component';
import {FirebaseMovieDetailRating, FirebaseMovieDetails} from '../../../details/components/comment-section/models/comment-section.model';
import {MovieDetailsService} from '../../../../shared/services/movie-details.service';
import {AbstractControl, Form, FormBuilder, FormGroup} from '@angular/forms';
import {ComponentBaseComponent} from '../../../../shared/components/component-base/component-base.component';
import {AuthService} from '../../../../shared/services/auth.service';
import {IUser, IUserPartialData} from '../../../../shared/models/IUser.model';

@Component({
    selector: 'app-filter-container',
    templateUrl: './filter-container.component.html',
    styleUrls: ['./filter-container.component.scss']
})
export class FilterContainerComponent extends ComponentBaseComponent implements OnInit {
    @Output() sortByFriendEmitter: EventEmitter<IUserPartialData> = new EventEmitter<IUserPartialData>();
    @Output() sortByMovieEmitter: EventEmitter<FirebaseMovieDetails> = new EventEmitter<FirebaseMovieDetails>();
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

    sortingFrom: FormGroup;
    user$: Observable<IUser>;
    sortingBySimilarMovies: FirebaseMovieDetails[] = [];
    selectedCategoryNames: string[] = ['Overall rating']; // user may select another categories to rate
    selectedCategories: FirebaseMovieDetailRating[] = [{
        type: 'Overall rating',
        rate: 50,
        reverse: false
    }];

    constructor(private fb: FormBuilder,
                private movieDetailService: MovieDetailsService,
                private authService: AuthService) {
        super();
    }


    ngOnInit(): void {
        this.applyCustomClassToPopOver();
        this.initAndWatchForm();
        this.user$ = this.authService.getUser();
        this.advanceSearchEmitter.emit(this.selectedCategories);
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

    selectedCategoryReverse(item: FirebaseMovieDetailRating) {
        this.selectedCategories = this.selectedCategories.map(category => {
            if (category.type === item.type) {
                return {...category, reverse: !category.reverse};
            }
            return category;
        });
        this.advanceSearchEmitter.emit(this.selectedCategories);
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
                type,
                reverse: false
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


    sortByMovie(movie: FirebaseMovieDetails) {
        this.sortingMovieName.patchValue(movie.movieData.title);
        this.sortByMovieEmitter.emit(movie);
    }

    sortByFriend(event: CustomEvent) {
        const friend = event.detail.value as IUserPartialData;
        this.sortByFriendEmitter.emit(friend);
    }

    changeRangeSelector(name: string, rate: number) {
        const item = this.selectedCategories.find(s => s.type === name);
        item.rate = rate;
        this.filterBasedOnRangeSelector();
    }


    get sortingMovieName(): AbstractControl {
        return this.sortingFrom.get('sortingMovieName') as AbstractControl;
    }

    private filterBasedOnRangeSelector() {
        const ratings: FirebaseMovieDetailRating[] = this.rangeSelectors.map(x => {
            const isReverse = this.selectedCategories.find(e => e.type === x.name).reverse;
            return {rate: x.value, type: x.name, reverse: isReverse};
        });
        this.advanceSearchEmitter.emit(ratings);
    }

    private initAndWatchForm() {
        this.sortingFrom = this.fb.group({
            sortingMovieName: [null]
        });

        this.sortingFrom.valueChanges.subscribe(moviePrefix => {
            this.sortingBySimilarMovies = this.movieDetailService.searchMovies
                .filter(m => m.movieData.title.startsWith(moviePrefix.sortingMovieName))
                .splice(0, 4);
        });
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
