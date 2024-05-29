"use client";

import { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Puzzle } from "@/types";
import { Chess } from "chess.js";
import { useAppSelector } from "@/store/hooks";

interface ChessGameProps {
  puzzle: Puzzle | null;
}

interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
  piece: string;
  color: string;
  flags: string;
  san: string;
  [key: string]: string | boolean | number | undefined;
}

export default function ChessGame({ puzzle }: ChessGameProps) {
  const [game, setGame] = useState<Chess>(new Chess());
  const [moveIdx, setMoveIndex] = useState<number>(0);
  const [orientation, setOrientation] = useState<"white" | "black">("white");

  const reduxPuzzle = useAppSelector(state => state.app.puzzle);

  const currentPuzzle = puzzle || reduxPuzzle;

  const soundsRef = useRef<{
    move: HTMLAudioElement | null;
    capture: HTMLAudioElement | null;
    check: HTMLAudioElement | null;
    castle: HTMLAudioElement | null;
    gameEnd: HTMLAudioElement | null;
    promotion: HTMLAudioElement | null;
    illegal: HTMLAudioElement | null;
  }>({
    move: null,
    capture: null,
    check: null,
    castle: null,
    gameEnd: null,
    promotion: null,
    illegal: null
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      soundsRef.current = {
        move: new Audio('/move.mp3'),
        capture: new Audio('/capture.mp3'),
        check: new Audio('/check.mp3'),
        castle: new Audio('/castle.mp3'),
        gameEnd: new Audio('/game-end.mp3'),
        promotion: new Audio('/promotion.mp3'),
        illegal: new Audio('/illegal.mp3')
      };

      Object.values(soundsRef.current).forEach(audio => {
        if (audio) audio.load();
      });
    }
  }, []);

  useEffect(() => {
    let newGame;
    if (currentPuzzle) {
      console.log(`initial fen: '${currentPuzzle.fen}'`);
      newGame = new Chess(currentPuzzle.fen);
      const whiteToMove = currentPuzzle.fen.split(' ')[1] === 'w';
      setOrientation(whiteToMove ? "white" : "black");
    } else {
      console.log('Using starting position');
      newGame = new Chess();
    }
    setGame(newGame);
    setMoveIndex(0);
  }, [currentPuzzle]);

  const playMoveSound = (move: ChessMove, gameState: Chess) => {
    const sounds = soundsRef.current;
    if (!sounds.move) return;
    if (gameState.isCheckmate()) {
      sounds.gameEnd?.play();
      return;
    }
    if (move.flags.includes('p')) {
      sounds.promotion?.play();
      return;
    }
    if (gameState.isCheck()) {
      sounds.check?.play();
      return;
    }
    if (move.flags.includes('c')) {
      sounds.capture?.play();
      return;
    }
    if (move.flags.includes('k') || move.flags.includes('q')) {
      sounds.castle?.play();
      return;
    }
    sounds.move.play();
  };

  const onDrop = (src: string, target: string) => {
    if (!currentPuzzle || !game) return false;

    const moves = currentPuzzle.moves.split(' ');
    const expectedUserMove = moves[moveIdx];
    const userMoveUci = src + target;

    if (expectedUserMove !== userMoveUci) {
      console.log(`Invalid move ${userMoveUci}. Expected move: ${expectedUserMove}`);
      soundsRef.current.illegal?.play();
      return false;
    }

    const newGame = new Chess(game.fen());
    const userMove = newGame.move({
      from: src,
      to: target,
    });

    setGame(newGame);
    setTimeout(() => playMoveSound(userMove as unknown as ChessMove, newGame), 50);

    const newMoveIndex = moveIdx + 1;
    if (newMoveIndex < moves.length) {
      setTimeout(() => {
        const computerMoveUci = moves[newMoveIndex];
        const computerGame = new Chess(newGame.fen());
        const computerMove = computerGame.move(computerMoveUci);
        if (computerMove === null) {
          console.error("Impossible move");
          return;
        }
        setGame(computerGame);
        setMoveIndex(newMoveIndex + 1);
        setTimeout(() => playMoveSound(computerMove as unknown as ChessMove, computerGame), 50);
      }, 400);
    } else {
      setMoveIndex(newMoveIndex);
    }

    if (moveIdx >= moves.length) {
      console.log("Puzzle completed!");
      return false;
    }

    return true;
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="w-full h-full max-w-[95%] max-h-[95%]">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardOrientation={orientation}
          animationDuration={200}
          id="responsive-chessboard"
          areArrowsAllowed={true}
          showBoardNotation={true}
        />
      </div>
    </div>
  );
}
