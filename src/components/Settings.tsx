"use client";

import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchPuzzle } from "@/store/appSlice";

interface SettingsProps {
  onNextPuzzle: () => void;
  onShowHint: () => void;
  onShowSolution: () => void;
}

export default function Settings({ onNextPuzzle, onShowHint, onShowSolution }: SettingsProps) {
  const dispatch = useAppDispatch();

  const handleNextPuzzle = () => {
    // Call both the prop function and dispatch the Redux action
    onNextPuzzle();
    dispatch(fetchPuzzle());
  };

  return (
    <div className="flex flex-col w-full gap-4 p-6 text-white">
      {/* Main Action Buttons */}
      <button
        onClick={handleNextPuzzle}
        className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-md transition-colors"
      >
         Next Puzzle
      </button>
      <button
        onClick={onShowHint}
        className="bg-amber-600 hover:bg-amber-700 p-3 rounded-md transition-colors"
      >
        Show Hint
      </button>
      <button
        onClick={onShowSolution}
        className="bg-rose-600 hover:bg-rose-700 p-3 rounded-md transition-colors"
      >
        Show Solution
      </button>
    </div>
  );
}
