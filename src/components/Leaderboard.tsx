import React, { useState } from 'react';
import { Placement } from '@/types';
import { useAppSelector } from '@/store/hooks';

type LeaderboardProps = {
  rating?: number;
  placements?: Placement[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  rating,
  placements
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("default");

  const reduxPlacements = useAppSelector(state => state.app.leaderboard.placements);
  const reduxRating = useAppSelector(state => state.app.puzzle?.rating || 0);
  
  const displayRating = rating !== undefined ? rating : reduxRating;
  const displayPlacements = placements || reduxPlacements;

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheme(e.target.value);
  };

  return (
    <div className="h-full w-full p-4 text-white flex flex-col relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-6xl font-bold text-indigo-400">
            {displayRating}
          </div>
          <div className="text-sm text-gray-400">
            Current Puzzle Rating
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-gray-200 hover:text-gray-100"
            title="What is Anti-puzzles?"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </button>

          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="text-gray-200 hover:text-gray-100"
            title="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <h2 className="text-xl font-semibold mb-2 text-gray-200">Leaderboard</h2>
        
        <div className="flex justify-between items-center bg-gray-700/70 p-2 rounded border border-gray-700 mb-2 font-medium">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 w-6">#</span>
            <span className="text-gray-200 w-24">Player</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-200 w-16 text-right">Rating</span>
            <span className="text-gray-200 w-16 text-right">Streak</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {displayPlacements.map((player, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-700/50 p-2 rounded border border-gray-700"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-6">{index + 1}.</span>
                <span className="text-gray-200 w-24">{player.handle}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium text-indigo-400 w-16 text-right">{player.score}</span>
                <span className="font-medium text-amber-400 w-16 text-right">{player.high_score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-gray-800 text-white z-10 p-6 rounded-lg max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-2">Objective</h3>
            <p className="mb-4">
              Given a puzzle, make the move that enables a tactic to the opponent. Play through the blunder to internalize how bad that move is
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsSettingsModalOpen(false)}></div>
          <div className="bg-gray-800 text-white z-10 p-6 rounded-lg max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-4">Settings</h3>
            <select
              value={selectedTheme}
              onChange={handleThemeChange}
              className="w-full p-2 bg-gray-700 text-white rounded mb-4"
            >
              <option value="default">Default</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
