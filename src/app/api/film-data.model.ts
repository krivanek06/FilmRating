export interface DiscoveredMoviesWrapper {
  page: number;
  total_results: number;
  total_pages: number;
  results: DiscoveredMovie[];
}

export interface DiscoveredMovie {
  popularity?: number;
  vote_count?: number;
  video?: boolean;
  poster_path?: string;
  id: number;
  adult?: boolean;
  backdrop_path?: string;
  original_language?: string;
  original_title: string;
  genre_ids: number[];
  title?: string;
  vote_average?: number;
  overview: string;
  release_date: string;
}

export interface GenreTypes {
  id: number;
  name: string;
}

export interface GenreTypesWrapper {
  genres: GenreTypes[];
}

/* -----------------------------------------*/

export interface MovieCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface ProductionCompanies {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountries {
  iso_3166_1: string;
  name: string;
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: MovieCollection;
  budget: number;
  genres: GenreTypes[];
  homepage: string;
  id: number;
  imdb_id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompanies[];
  production_countries: ProductionCountries[];
  release_date: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

/* -----------------------------------------*/
export interface CastWrapper {
  cast: Actor[];
}

export interface Actor {
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  name: string;
  order: number;
  profile_path: string;
}


export interface PersonDetails {
  birthday: string;
  known_for_department: string;
  deathday?: string;
  id: number;
  name: string;
  also_known_as: string;
  gender: number;
  biography: string;
  popularity: number;
  place_of_birth: string;
  profile_path: string;
  adult: boolean;
  imdb_id: string;
  homepage?: string;
}


export interface MovieTrailer {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: string;
  type: string;
}

export interface MovieImages {
  aspect_ratio: string;
  file_path: string;
  height: string;
  iso_639_1: string;
  vote_average: string;
  vote_count: string;
  width: string;
}
