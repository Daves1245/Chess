"use client";

import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Puzzle } from "@/types";
import { Chess } from "chess.js";

interface ChessGameProps {
  puzzle: Puzzle | null;
}

export default function ChessGame({ puzzle }: ChessGameProps) {
  const [game, setGame] = useState<Chess>(new Chess());
  const [moveIndex, setMoveIndex] = useState<number>(0);
  const [orientation, setOrientation] = useState<"white" | "black">("white");

  useEffect(() => {
    if (puzzle) {
      const initialFen = puzzle.fen || "start";
      const newGame = new Chess(initialFen);
      setGame(newGame);
      setMoveIndex(0);

      const isWhiteToMove = initialFen.split(' ')[1] === 'w';
      setOrientation(isWhiteToMove ? "white" : "black");
    }
  }, [puzzle]);

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (!puzzle || !game) return false;

    const movesArray = puzzle.moves.split(' ');

    if (moveIndex >= movesArray.length) {
      console.log("Puzzle completed!");
      return false;
    }

    const expectedUserMove = movesArray[moveIndex];
    const userMoveUci = sourceSquare + targetSquare;
    if (!expectedUserMove.startsWith(userMoveUci)) {
      console.log("Invalid move. Expected move:", expectedUserMove);
      return false;
    }

    const promotion = expectedUserMove.length > 4 ? expectedUserMove[4] : undefined;

    const newGame = new Chess(game.fen());
    const userMove = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: promotion
    });

    if (userMove === null) {
      console.error("illegal move");
      return false;
    }

    let newMoveIndex = moveIndex + 1;

    if (newMoveIndex < movesArray.length) {
      const computerMoveUci = movesArray[newMoveIndex];
      const from = computerMoveUci.substring(0, 2);
      const to = computerMoveUci.substring(2, 4);
      const compPromotion = computerMoveUci.length > 4 ? computerMoveUci[4] : undefined;

      const computerMove = newGame.move({
        from: from,
        to: to,
        promotion: compPromotion
      });

      if (computerMove === null) {
        console.error("illegal move, shouldn't be possible");
        return false;
      }
      newMoveIndex++;
    }

    setGame(newGame);
    setMoveIndex(newMoveIndex);
    return true;
  };

  return (
    <div className="h-full w-full">
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardOrientation={orientation}
        customBoardStyle={{
          borderRadius: "10px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
        }}
        animationDuration={500}
        boardWidth={400}
        areArrowsAllowed={true}
        showBoardNotation={true}
      />
    </div>
  );
}
