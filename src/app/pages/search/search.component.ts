import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FilmDataService} from '../../api/film-data.service';
import {ActivatedRoute} from '@angular/router';
import {filter, find, flatMap, map, shareReplay, switchMap, takeUntil, tap, toArray} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {DiscoveredMoviePartialData, DiscoveredMoviesWrapper, GenreTypes, MovieDetails} from '../../api/film-data.model';
import {ComponentBaseComponent} from '../../shared/components/component-base/component-base.component';
import {CategorySort} from './models/filter.model';
import {
    FirebaseMovieDetailRating,
    FirebaseMovieDetails,
    joinName
} from '../details/components/comment-section/models/comment-section.model';
import {MovieDetailsService} from '../../shared/services/movie-details.service';
import {FriendSorting, IUserPartialData} from '../../shared/models/IUser.model';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent extends ComponentBaseComponent implements OnInit {
    discoveredMovies$: Observable<DiscoveredMoviesWrapper>;
    firebaseMovies: DiscoveredMoviePartialData[];
    genreTypes$: Observable<GenreTypes[]>;

    selectedGenreTypes: GenreTypes[] = [];    // user select what type of films want to watch -> action, comedy, etc.
    pageNumber = 1;                           // which page I am listing
    sortBy: CategorySort = {
        displayName: 'Popularity descending',
        sortName: 'popularity.desc'
    };
    advanceSearchToggle = false;

    constructor(private filmDataService: FilmDataService,
                private movieDetailService: MovieDetailsService,
                private route: ActivatedRoute) {
        super();
    }

    ngOnInit(): void {
        this.genreTypes$ = this.filmDataService.getGenresTypes().pipe(shareReplay());
        this.getGenreIdFromQueryParam();
        this.searchMovies();
    }

    changePage(pageNumber: number) {
        this.pageNumber = pageNumber;
        this.searchMovies();
    }

    filterByGenreTypes(genreTypes: GenreTypes[]) {
        this.selectedGenreTypes = genreTypes;
        this.searchMovies();
    }

    removeSelectedGenderType(genreTypes: GenreTypes) {
        this.selectedGenreTypes = this.selectedGenreTypes.filter(x => x !== genreTypes);
        this.searchMovies();
    }

    changeSorting(sortName: CategorySort) {
        this.sortBy = sortName;
        this.searchMovies();
    }

    advanceSearchToggleEmitter(toggle: boolean) {
        if (toggle === this.advanceSearchToggle) {
            return;
        }
        this.advanceSearchToggle = !this.advanceSearchToggle;
    }

    advanceSearchEmitter(data: FirebaseMovieDetailRating[]) {
        data = data.map(d => {
            return {type: joinName(d.type), rate: d.rate, reverse: d.reverse};
        });

        const allMovies = this.movieDetailService.searchMovies;
        const filtered = allMovies.filter(x => {
            const movieResult = data.map(rate => {
                if (x[rate.type] >= rate.rate) {
                    return !rate.reverse;
                }
                return rate.reverse;
            });
            return !movieResult.includes(false);
        });
        this.firebaseMovies = filtered.map(x => x.movieData);
    }

    // check prefix when sorting
    sortByMovie(movieDetails: FirebaseMovieDetails) {
        const movie = this.firebaseMovies.find(x => x.title === movieDetails.movieData.title);
        this.sortByVote(movie.vote_average);
        const similarName = this.firebaseMovies.filter(x => x.title.startsWith(movieDetails.movieData.title.substring(0, 6)));
        const distinct = this.firebaseMovies.filter(x => x.title !== movie.title && !similarName.includes(x));
        this.firebaseMovies = [...similarName, ...distinct];
    }

    sortByFriend(friend: IUserPartialData) {
        const existingFriend = this.movieDetailService.sortByFriendCash.find(x => x.friendUID === friend.uid);
        if (!!existingFriend) {
            this.sortByVote(existingFriend.value);
            return;
        }
        const sorting: FriendSorting = {
            friendUID: friend.uid,
            value: Math.random() * Math.floor(6) + 4
        };
        this.movieDetailService.sortByFriendCash = [...this.movieDetailService.sortByFriendCash, sorting];
        this.sortByVote(sorting.value);
    }

    private sortByVote(value: number) {
        this.firebaseMovies = this.firebaseMovies.sort((a, b) => {
            const aVotes = Math.abs(a.vote_average - value);
            const bVotes = Math.abs(b.vote_average - value);
            return aVotes >= bVotes ? 1 : -1;
        });
    }

    private searchMovies() {
        this.discoveredMovies$ = this.filmDataService.discoverMovies(this.selectedGenreTypes, this.pageNumber, this.sortBy);
    }


    private getGenreIdFromQueryParam() {
        this.route.queryParamMap.pipe(
            map(data => Number(data.get('genreID'))),
            filter(x => !!x),
            switchMap(id => this.genreTypes$.pipe(
                map(type => type.find(e => e.id === id))
            )),
            takeUntil(this.destroy$)
        ).subscribe(x => {
            this.selectedGenreTypes = [...this.selectedGenreTypes, x];
            this.searchMovies();
        });

    }

}
