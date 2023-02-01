"use client";

import { Chess } from "chess.js";
import { useState } from "react";
import { Chessboard } from "react-chessboard";

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());

  // only legal moves accepted
  const onDrop = (sourceSquare, targetSquare) => {
    const newGame = new Chess(game.fen());

    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Always promote to queen for simplicity
    });

    if (move) {
      setGame(newGame);
      return true;
    }

    return false;
  };

  return (
    <div className="h-full w-full">
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardOrientation="white"
        customBoardStyle={{
          borderRadius: "10px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
        }}
      />
    </div>
  );
}
