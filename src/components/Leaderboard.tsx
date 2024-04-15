import React from 'react';
import { Placement } from '@/types';

type LeaderboardProps = {
  rating?: number;
  placements?: Placement[];
}

const dummyPlacements: Placement[] = [
    { handle: "Alice", score: 2100 },
    { handle: "Bob", score: 2050 },
    { handle: "Charlie", score: 1950 },
    { handle: "Diana", score: 1900 },
    { handle: "Eve", score: 1850 }
]

const Leaderboard: React.FC<LeaderboardProps> = ({
  rating = 0,
  placements = dummyPlacements
  }) => {
  return (
    <div className="h-full w-full p-4 text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="text-6xl font-bold text-indigo-400">
            {rating}
          </div>
          <div className="text-sm text-gray-400">
            Current Rating
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Leaderboard</h2>
        <div className="space-y-2 overflow-y-auto h-48 pr-2">
          {placements.map((player, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-700/50 p-2 rounded border border-gray-700"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-6">{index + 1}.</span>
                <span className="text-gray-200">{player.handle}</span>
              </div>
              <span className="font-medium text-indigo-400">{player.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
