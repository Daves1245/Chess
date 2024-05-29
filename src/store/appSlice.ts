import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState, Puzzle, Leaderboard, Placement } from '@/types';

const initialState: AppState = {
  puzzle: null,
  leaderboard: {
    placements: [
      { handle: "Alice", score: 2100, high_score: 2200 },
      { handle: "Bob", score: 2050, high_score: 2150 },
      { handle: "Charlie", score: 1950, high_score: 2050 },
      { handle: "Diana", score: 1900, high_score: 2000 },
      { handle: "Eve", score: 1850, high_score: 1950 }
    ]
  }
};

// Async thunk for fetching a puzzle
export const fetchPuzzle = createAsyncThunk(
  'app/fetchPuzzle',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/puzzle');
      if (!response.ok) {
        throw new Error('Failed to fetch puzzle');
      }
      const puzzle = await response.json();
      return puzzle as Puzzle;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setPuzzle: (state, action: PayloadAction<Puzzle>) => {
      state.puzzle = action.payload;
    },
    setLeaderboard: (state, action: PayloadAction<Leaderboard>) => {
      state.leaderboard = action.payload;
    },
    updatePlacements: (state, action: PayloadAction<Placement[]>) => {
      state.leaderboard.placements = action.payload;
    },
    clearPuzzle: (state) => {
      state.puzzle = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPuzzle.fulfilled, (state, action) => {
        state.puzzle = action.payload;
      })
      .addCase(fetchPuzzle.rejected, (state) => {
        state.puzzle = null;
      });
  },
});

export const { setPuzzle, setLeaderboard, updatePlacements, clearPuzzle } = appSlice.actions;
export default appSlice.reducer;
