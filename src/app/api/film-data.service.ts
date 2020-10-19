import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Actor, CastWrapper, DiscoveredMovie, DiscoveredMoviesWrapper, GenreTypes, GenreTypesWrapper, MovieDetails} from './film-data.model';
import {map, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilmDataService {

  constructor(private http: HttpClient) {
  }


  // TODO - used by Simon
  /**
   * API - https://developers.themoviedb.org/3/discover/movie-discover
   * @param genresId - gender id from https://developers.themoviedb.org/3/genres/get-movie-list
   * @param page - use to sort result
   */
  discoverMovies(genresId: number[] = [], page = 1): Observable<DiscoveredMoviesWrapper> {
    const params = new HttpParams()
      .set('api_key', environment.theMovieDbAPI)
      .set('sort_by', 'popularity.desc')
      .set('language', 'en-US')
      .set('include_adult', 'false')
      .set('include_video', 'false')
      .set('page', String(page))
      .set('with_genres', genresId.join('AND'));
    return this.http.get<DiscoveredMoviesWrapper>('https://api.themoviedb.org/3/discover/movie', {params});
  }

  // TODO - used by Simon, Robo
  /**
   * will return film genres. Genre id will be needed for 'genresId' in discoverMovies
   */
  getGenresTypes(): Observable<GenreTypes[]> {
    const params = new HttpParams()
      .set('api_key', environment.theMovieDbAPI)
      .set('sort_by', 'popularity.desc')
      .set('language', 'en-US');
    return this.http.get<GenreTypesWrapper>('https://api.themoviedb.org/3/genre/movie/list', {params})
      .pipe(map(res => res.genres));
  }

  // TODO - used by Robo
  /**
   * API - https://developers.themoviedb.org/3/trending/get-trending
   */
  getTrendingMovies(): Observable<DiscoveredMovie[]> {
    const params = new HttpParams().set('api_key', environment.theMovieDbAPI);
    return this.http.get<DiscoveredMoviesWrapper>('https://api.themoviedb.org/3/trending/movie/day', {params})
      .pipe(
        map(res => res.results.slice(0, 12))
      );
  }

  // TODO - used by Robo
  /**
   * API - https://developers.themoviedb.org/3/movies/get-upcoming
   */
  getUpcomingMovies(): Observable<DiscoveredMovie[]> {
    const params = new HttpParams()
      .set('api_key', environment.theMovieDbAPI)
      .set('sort_by', 'popularity.desc')
      .set('language', 'en-US');
    return this.http.get<DiscoveredMoviesWrapper>('https://api.themoviedb.org/3/movie/upcoming', {params})
      .pipe(
        map(res => res.results.slice(0, 12))
      );
  }

  // TODO - will be used by Eduard
  /**
   * API - https://developers.themoviedb.org/3/search/search-movies
   */
  searchMovieByName(namePrefix: string): Observable<DiscoveredMoviesWrapper> {
    const params = new HttpParams()
      .set('api_key', environment.theMovieDbAPI)
      .set('sort_by', 'popularity.desc')
      .set('language', 'en-US')
      .set('page', '1')
      .set('include_adult', 'false')
      .set('query', namePrefix);

    return this.http.get<DiscoveredMoviesWrapper>('https://api.themoviedb.org/3/search/movie', {params});
  }

  // TODO - will be used by Adam
  /**
   * API  - https://developers.themoviedb.org/3/movies/get-movie-details
   * @param movieId - test with 603 (Matrix)
   */
  getMovieDetails(movieId: number): Observable<MovieDetails> {
    const params = new HttpParams()
      .set('api_key', environment.theMovieDbAPI)
      .set('language', 'en-US');

    return this.http.get<MovieDetails>(`https://api.themoviedb.org/3/movie/${movieId}`, {params});
  }

  // TODO - will be used by Adam
  /**
   * API  - https://developers.themoviedb.org/3/movies/get-movie-credits
   * @param movieId - test with 603 (Matrix)
   */
  getActorsForMovie(movieId: number): Observable<Actor[]> {
    const params = new HttpParams().set('api_key', environment.theMovieDbAPI);

    return this.http.get<CastWrapper>(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {params})
      .pipe(map(res => res.cast));
  }


  // TODO - maybe Eduard, not necessary to implement
  /**
   * API - https://developers.themoviedb.org/3/people/get-person-details
   */
  getPersonDetails(personId: number) {
    const params = new HttpParams()
      .set('api_key', environment.theMovieDbAPI)
      .set('language', 'en-US');

    return this.http.get(`https://api.themoviedb.org/3/person/${personId}`, {params});
  }


}
