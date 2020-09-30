export interface FirebaseMovieDetails {
  comments?: FirebaseMovieDetailComment[];
}

export interface FirebaseMovieDetailComment {
  id: string;
  comment: string;
  person: string;
  timestamp: number;
  ratings?: FirebaseMovieDetailRating[];
  likes?: string[];
  dislikes?: string[];
  subComments?: FirebaseMovieDetailComment[];
}

export interface FirebaseMovieDetailRating {
  rate: number;
  type: string;
}
