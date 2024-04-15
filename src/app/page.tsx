"use client";

import React from "react";
import ChessGame from "@/components/ChessGame";
import Leaderboard from "@/components/Leaderboard";
import Settings from "@/components/Settings";
import { Puzzle, Placement } from '@/types';
import { useState, useEffect } from 'react';

export default function Home() {

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [error, setError] = useState<string | null>('');
  const [rating, setRating] = useState<number>(0);
  const [placements, setPlacements] = useState<Placement[]>([
    { handle: "Alice", score: 2100 },
    { handle: "Bob", score: 2050 },
    { handle: "Charlie", score: 1950 },
    { handle: "Diana", score: 1900 },
    { handle: "Eve", score: 1850 }
  ]);

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
        if (data.rating) {
          setRating(data.rating);
        }
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
      if (data.rating) {
        setRating(data.rating);
      }
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
        <div className="flex-1 bg-gray-800 flex items-center justify-center w-full h-full overflow-hidden min-w-0 min-h-0 border border-gray-700 p-2">
          <div className="w-full h-full max-w-[75vh] max-h-[75vh]">
            <ChessGame
              puzzle={puzzle}
            />
          </div>
        </div>

        {/* Leaderboard & Settings */}
        <div className="flex flex-col flex-1 gap-5 overflow-hidden min-w-0 min-h-0">
          {/* Leaderboard */}
          <div className="flex-1 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center overflow-hidden min-w-0 min-h-0 border border-gray-700">
            <Leaderboard 
              rating={rating}
              placements={placements}
            />
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
      </div>
    </div>
  );
}
