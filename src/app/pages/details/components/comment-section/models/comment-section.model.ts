import {IUserPartialData} from '../../../../../shared/models/IUser.model';
import {DiscoveredMovie, DiscoveredMoviePartialData} from '../../../../../api/film-data.model';

export interface FirebaseMovieDetails {
  id?: string;
  averageRatings?: FirebaseMovieDetailRatingAverage[];
  movieData?: DiscoveredMoviePartialData;
}

export interface FirebaseMovieDetailComment {
  id?: string;
  comment: string;
  person: IUserPartialData;
  timestamp: number;
  likes?: string[];
  dislikes?: string[];
}

export interface FirebaseMovieDetailReview extends FirebaseMovieDetailComment {
  ratings?: FirebaseMovieDetailRating[];
  comments?: FirebaseMovieDetailComment[];
}

export interface FirebaseMovieDetailRating {
  rate: number;
  type: string;
}

export interface FirebaseMovieDetailRatingAverage extends FirebaseMovieDetailRating {
  numberOfUsers: number;
}


export const joinName = (type: string) => {
  return type.split(' ').join('_');
};


