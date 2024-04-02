"use client";

import React from "react";
import ChessGame from "@/components/ChessGame";
import Leaderboard from "@/components/Leaderboard";
import Settings from "@/components/Settings";
import { Puzzle } from '@/types';
import { useState, useEffect } from 'react';

export default function Home() {

  const [puzzle, setPuzzle] = useState<Puzzle | null>();
  const [error, setError] = useState<string | null>('');

  useEffect(() => {
    const initPuzzle = async ()=> {
      try {
        setError(null);
        const res = await fetch('/api/puzzle', { method: 'GET' });

        if (!res.ok) {
          throw new Error(await res.json() || "Failed to fetch puzzle");
        }
        
        const data = await res.json();
        setPuzzle(data);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        console.error("Error fetching puzzle: ", error);
      }
    }

    initPuzzle();
  }, []);

  const onNextPuzzle = async ()=> {
    try {
      const res = await fetch('/api/puzzle');
      const data = await res.json();
      setPuzzle(data);
      console.log("puzzle: ", data);
    } catch (error: unknown) {
      console.error("Error fetching puzzle: ", error);
    }
  }

  const onShowHint = ()=> {

  }

  const onShowSolution = ()=> {

  }

  const onSetCustomPosition = ()=> {

  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="h-[10vh] bg-gray-800 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-3xl font-bold text-white">Anti-puzzles</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 overflow-hidden flex gap-5 bg-gray-900 min-w-0 min-h-0">
        {/* Chessboard Container */}
        <div className="flex-1 bg-gray-800 rounded-lg shadow-lg flex justify-center w-full h-full w-max-full h-max-full overflow-hidden min-w-0 min-h-0 border border-gray-700">
          <div className="aspect-square w-[80%] h-[80%] min-w-0 min-h-0">
            <ChessGame
              puzzle={puzzle}
            />
          </div>
        </div>

        {/* Leaderboard & Settings */}
        <div className="flex flex-col flex-1 gap-5 overflow-hidden min-w-0 min-h-0">
          {/* Leaderboard */}
          <div className="flex-1 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center overflow-hidden min-w-0 min-h-0 border border-gray-700">
            <Leaderboard />
          </div>

          {/* Settings */}
          <div className="flex-1 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center overflow-hidden min-w-0 min-h-0 border border-gray-700">
            <Settings
              onNextPuzzle={onNextPuzzle}
              onShowHint={onShowHint}
              onShowSolution={onShowSolution}
              onSetCustomPosition={onSetCustomPosition}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-[10vh] bg-gray-800 flex items-center justify-center border-t border-gray-700">
        <span className="text-gray-400">© 2024 Anti-puzzles</span>
      </div>
    </div>
  );
}
