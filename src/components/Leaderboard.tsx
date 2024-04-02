import React from 'react';

const Leaderboard = () => {
  // Sample data - in a real app this would come from props or an API
  const currentRating = 1842;
  const leaderboard = [
    { rank: 1, name: "Alice", rating: 2100 },
    { rank: 2, name: "Bob", rating: 2050 },
    { rank: 3, name: "Charlie", rating: 1950 },
    { rank: 4, name: "Diana", rating: 1900 },
    { rank: 5, name: "Eve", rating: 1850 }
  ];

  return (
    <div className="h-full w-full p-4 text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="text-6xl font-bold text-indigo-400">
            {currentRating}
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
          {leaderboard.map((player) => (
            <div
              key={player.rank}
              className="flex justify-between items-center bg-gray-700/50 p-2 rounded border border-gray-700"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-6">{player.rank}.</span>
                <span className="text-gray-200">{player.name}</span>
              </div>
              <span className="font-medium text-indigo-400">{player.rating}</span>
            </div>
        ))}
      </div>
    </div>
  </div>
);
};

export default Leaderboard;
