/* Interfaces receiving API data response from The Movie Database API*/
export interface TMDBActorDetails {
  id: number;
  name: string;
}

export interface TMDBMovieCredits {
  cast: Array<{
    id: number;
    title: string;
    character?: string;
  }>;
  crew: Array<{
    id: number;
    title: string;
    job?: string;
  }>;
}

export interface TMDBTVCredits {
  cast: Array<{
    id: number;
    name: string;
    character?: string;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job?: string;
  }>;
}

export interface TMDBPopularActors {
  results: Array<{
    id: number;
    name: string;
  }>;
}