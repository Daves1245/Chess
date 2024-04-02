"use client";

import { useState } from "react";

export default function Settings({ onNextPuzzle, onShowHint, onShowSolution, onSetCustomPosition }) {
  const [fen, setFen] = useState("");

  const handleFenChange = (e) => {
    setFen(e.target.value);
  };

  const handleSetPosition = () => {
    if (onSetCustomPosition) {
      onSetCustomPosition(fen);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 p-4 text-white">
      {/* Skip / Next Puzzle */}
      <button
        onClick={onNextPuzzle}
        className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-md transition-colors"
      >
         Next Puzzle
      </button>

      {/* Show Hint */}
      <button
        onClick={onShowHint}
        className="bg-amber-600 hover:bg-amber-700 p-3 rounded-md transition-colors"
      >
        Show Hint
      </button>

      {/* Show Solution */}
      <button
        onClick={onShowSolution}
        className="bg-rose-600 hover:bg-rose-700 p-3 rounded-md transition-colors"
      >
        Show Solution
      </button>

      {/* Custom Position Setup */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-300">Set Custom Position (FEN):</label>
        <input
          type="text"
          value={fen}
          onChange={handleFenChange}
          placeholder="e.g., rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          className="p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-indigo-500 focus:outline-none"
        />
        <button
          onClick={handleSetPosition}
          className="bg-emerald-600 hover:bg-emerald-700 p-2 rounded-md transition-colors"
        >
          Set Position
        </button>
      </div>
    </div>
  );
}
