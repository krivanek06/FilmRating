export interface FirebaseMovieDetails {
  id: string;
}

export interface FirebaseMovieDetailComment {
  id?: string;
  comment: string;
  person: string;
  timestamp: number;
  likes?: string[];
  dislikes?: string[];
}

export interface FirebaseMovieDetailReview extends  FirebaseMovieDetailComment{
  ratings?: FirebaseMovieDetailRating[];
  comments?: FirebaseMovieDetailComment[];
}

export interface FirebaseMovieDetailRating {
  rate: number;
  type: string;
}



