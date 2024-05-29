export enum TimeControl {
  blitz,
    rapid,
    survival,
}
export enum GameMode {
  Puzzles,
    Duel,
    Tournament,
}

export interface AppState {
  puzzle: Puzzle | null;
  leaderboard: Leaderboard;
  timeControl: TimeControl;
  gameMode: GameMode;
}

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
  placements: Placement[];
}

export interface Placement {
  handle: string;
  score: number;
  high_score: number;
}
