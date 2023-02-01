export type AppState =
  | { type: "loggedOut" }
  | { type: "loggedIn",
    user: User,
    puzzle: Puzzle,
    leaderBoard: Leaderboard,
  };

interface User {
  handle: string;
}

interface Puzzle {
  id: string;
  fen: string;
  solution: string;
  rating: string;
}

interface Leaderboard {
  board: Placement[];
}

interface Placement {
  handle: string;
  score: number;
}
