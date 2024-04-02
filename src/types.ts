export type AppState =
  | { type: "loggedOut" }
  | { type: "loggedIn",
    user: User,
    puzzle: Puzzle,
    leaderBoard: Leaderboard,
  };

export interface User {
  handle: string;
}

export interface Puzzle {
  puzzle_id: string;
  fen: string;
  moves: string;
  rating: number;
  rating_deviation: number;
  popularity: number;
  nb_plays: number;
  themes: string;
  game_url: string;
  opening_tags: string | null; // Since some entries might be empty
}

export interface Leaderboard {
  board: Placement[];
}

export interface Placement {
  handle: string;
  score: number;
}
