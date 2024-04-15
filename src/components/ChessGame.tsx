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
  const [moveIdx, setMoveIndex] = useState<number>(0);
  const [orientation, setOrientation] = useState<"white" | "black">("white");

  useEffect(() => {
    let newGame;
    if (puzzle) {
      console.log(`initial fen: '${puzzle.fen}'`);
      newGame = new Chess(puzzle.fen);

      const whiteToMove = puzzle.fen.split(' ')[1] === 'w';
      setOrientation(whiteToMove ? "white" : "black");
    } else {
      console.log('Using starting position');
      newGame = new Chess();
    }
    setGame(newGame);
    setMoveIndex(0);
  }, [puzzle]);

  const onDrop = (src: string, target: string) => {
    if (!puzzle || !game) return false;

    const moves = puzzle.moves.split(' ');

    if (moveIdx >= moves.length) {
      console.log("Puzzle completed!");
      return false;
    }

    const expectedUserMove = moves[moveIdx];
    const userMoveUci = src + target;
    if (expectedUserMove !== userMoveUci) {
      console.log(`Invalid move ${userMoveUci}. Expected move: ${expectedUserMove}`);
      return false;
    }

    const newGame = new Chess(game.fen());
    const userMove = newGame.move({
      from: src,
      to: target,
    });

    let newMoveIndex = moveIdx + 1;

    if (newMoveIndex < moves.length) {
      const computerMoveUci = moves[newMoveIndex];
      const computerMove = newGame.move(computerMoveUci);
      if (computerMove === null) {
        console.error("Impossible move");
        return false;
      }
      newMoveIndex++;
    }

    setGame(newGame);
    setMoveIndex(newMoveIndex);
    return true;
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="w-full h-full max-w-[95%] max-h-[95%]">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardOrientation={orientation}
          animationDuration={500}
          id="responsive-chessboard"
          areArrowsAllowed={true}
          showBoardNotation={true}
        />
      </div>
    </div>
  );
}
