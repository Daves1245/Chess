import React, { useState } from 'react';
import { GiPuzzle, GiCrossedSwords, GiTrophy, GiHourglass, GiDeathSkull } from 'react-icons/gi';
import { IoFlash } from 'react-icons/io5';

const PuzzleModal = ({ onStart }: { onStart: () => void }) => {
  const [gameType, setGameType] = useState('Puzzle');
  const [timeConstraint, setTimeConstraint] = useState('3 min');

  const highlightBgColor = "bg-blue-600";
  const highlightTextColor = "text-blue-500";
  const buttonBgColor = "bg-blue-600";
  const buttonHoverColor = "hover:bg-blue-500";

  const gameTypes = [
    { id: 'puzzle', name: 'Puzzle', icon: (isSelected: boolean) => (
      <div className={`${isSelected ? highlightBgColor : 'bg-gray-700'} rounded-full p-4 w-16 h-16 flex items-center justify-center`}>
        <GiPuzzle size={24} className={isSelected ? 'text-white' : 'text-gray-400'} />
      </div>
    )},
    { id: 'duel', name: 'Duel', icon: (isSelected: boolean) => (
      <div className={`${isSelected ? highlightBgColor : 'bg-gray-700'} rounded-full p-4 w-16 h-16 flex items-center justify-center`}>
        <GiCrossedSwords size={24} className={isSelected ? 'text-white' : 'text-gray-400'} />
      </div>
    )},
    { id: 'tournament', name: 'Tournament', icon: (isSelected: boolean) => (
      <div className={`${isSelected ? highlightBgColor : 'bg-gray-700'} rounded-full p-4 w-16 h-16 flex items-center justify-center`}>
        <GiTrophy size={24} className={isSelected ? 'text-white' : 'text-gray-400'} />
      </div>
    )}
  ];

  const timeControls = [
    { id: '3min', name: '3 min', icon: (isSelected: boolean) => (
      <div className={`${isSelected ? highlightBgColor : 'bg-gray-700'} rounded-full w-12 h-12 flex items-center justify-center`}>
        <IoFlash size={24} className={isSelected ? 'text-white' : 'text-gray-400'} />
      </div>
    )},
    { id: '5min', name: '5 min', icon: (isSelected: boolean) => (
      <div className={`${isSelected ? highlightBgColor : 'bg-gray-700'} rounded-full w-12 h-12 flex items-center justify-center`}>
        <GiHourglass size={24} className={isSelected ? 'text-white' : 'text-gray-400'} />
      </div>
    )},
    { id: 'survival', name: 'Survival', icon: (isSelected: boolean) => (
      <div className={`${isSelected ? highlightBgColor : 'bg-gray-700'} rounded-full w-12 h-12 flex items-center justify-center`}>
        <GiDeathSkull size={24} className={isSelected ? 'text-white' : 'text-gray-400'} />
      </div>
    )}
  ];

  const getDescriptionText = () => {
    switch(timeConstraint) {
      case '3 min':
        return 'Solve puzzles in 3 minutes!';
      case '5 min':
        return 'Solve puzzles in 5 minutes!';
      case 'Survival':
        return 'Unlimited chess puzzles!';
      default:
        return 'Solve puzzles!';
    }
  };

  const handleStart = () => {
    onStart();
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-4 bg-gray-800">
          <h2 className="text-3xl font-bold text-center text-gray-400 tracking-wider mb-4">PUZZLES</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {gameTypes.map((type) => {
              const isSelected = gameType === type.name;
              return (
                <div
                  key={type.id}
                  className="flex flex-col items-center cursor-pointer transition-all duration-200 transform hover:scale-105"
                  onClick={() => setGameType(type.name)}
                >
                  <div className={`${isSelected ? 'scale-110' : ''} transition-transform duration-200`}>
                    {type.icon(isSelected)}
                  </div>
                  <span className={`mt-2 text-lg ${isSelected ? highlightTextColor + ' font-medium' : 'text-gray-400'}`}>
                    {type.name}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-700 bg-opacity-50 rounded-md">
            {timeControls.map((time) => {
              const isSelected = timeConstraint === time.name;
              return (
                <div
                  key={time.id}
                  className="flex flex-col items-center cursor-pointer transition-all duration-200 transform hover:scale-105"
                  onClick={() => setTimeConstraint(time.name)}
                >
                  <div className={`${isSelected ? 'scale-110' : ''} transition-transform duration-200`}>
                    {time.icon(isSelected)}
                  </div>
                  <span className={`mt-2 text-lg ${isSelected ? highlightTextColor + ' font-medium' : 'text-gray-400'}`}>
                    {time.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 text-center">
          <p className="text-xl text-gray-300">{getDescriptionText()}</p>
        </div>

        <div className="p-4">
          <button
            onClick={handleStart}
            className={`w-full py-4 ${buttonBgColor} ${buttonHoverColor} text-white text-2xl font-medium rounded transition-colors duration-200`}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default PuzzleModal;
