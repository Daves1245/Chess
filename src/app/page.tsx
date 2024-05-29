"use client";

import React, { useEffect } from "react";
import ChessGame from "@/components/ChessGame";
import Leaderboard from "@/components/Leaderboard";
import Settings from "@/components/Settings";
import PuzzleModal from "@/components/puzzle-modal";
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPuzzle } from "@/store/appSlice";

export default function Home() {
  const [showModal, setShowModal] = useState<boolean>(true);
  const [, setErrorMessage] = useState<string | null>('');
  
  const dispatch = useAppDispatch();
  const puzzle = useAppSelector(state => state.app.puzzle);
  const rating = useAppSelector(state => state.app.puzzle?.rating || 0);
  const placements = useAppSelector(state => state.app.leaderboard.placements);

  useEffect(() => {
    const initPuzzle = async () => {
      try {
        setErrorMessage(null);
        await dispatch(fetchPuzzle()).unwrap();
      } catch (error: unknown) {
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
        console.error("Error fetching puzzle: ", error);
      }
    }

    initPuzzle();
  }, [dispatch]);

  const onNextPuzzle = async () => {
    try {
      await dispatch(fetchPuzzle()).unwrap();
    } catch (error: unknown) {
      console.error("Error fetching puzzle: ", error);
    }
  }

  const onShowHint = () => {
    // TODO
  }

  const onShowSolution = () => {
    // TODO
  }

  const handleStartPuzzle = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="h-[10vh] bg-gray-800 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-3xl font-bold text-white">Anti-puzzles</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 overflow-hidden flex gap-5 bg-gray-900 min-w-0 min-h-0">
        {/* Chessboard Container */}
        <div className="flex-1 bg-gray-800 flex items-center justify-center w-full h-full overflow-hidden min-w-0 min-h-0 border border-gray-700 p-2 relative">
          <div className="w-full h-full max-w-[75vh] max-h-[75vh] relative">
            <ChessGame
              puzzle={puzzle}
            />
            {/* Puzzle Modal */}
            {showModal && <PuzzleModal onStart={handleStartPuzzle} />}
          </div>
        </div>

        {/* Leaderboard & Settings */}
        <div className="flex flex-col flex-1 gap-5 overflow-hidden min-w-0 min-h-0">
          {/* Leaderboard */}
          <div className="flex-[3] bg-gray-800 rounded-lg shadow-lg flex items-center justify-center overflow-hidden min-w-0 min-h-0 border border-gray-700">
            <Leaderboard
              rating={rating}
              placements={placements}
            />
          </div>

          {/* Settings */}
          <div className="flex-initial bg-gray-800 rounded-lg shadow-lg flex items-center justify-center overflow-hidden min-w-0 min-h-0 border border-gray-700 py-2">
            <Settings
              onNextPuzzle={onNextPuzzle}
              onShowHint={onShowHint}
              onShowSolution={onShowSolution}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-[10vh] bg-gray-800 flex items-center justify-center border-t border-gray-700">
      </div>
    </div>
  );
}
