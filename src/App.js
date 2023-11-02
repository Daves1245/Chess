import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

import useStockfishEngine from './Engine.js';

const DEPTH = 8;
const FEN_POSITION = 
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export default function App() {
    const [game, setGame] = useState(new Chess());
    const { evaluatePosition, stop, bestMove } = useStockfishEngine();

    useEffect(()=> {

    }, [game]);

    function onDrop(sourceSquare, targetSquare) {
        const move = {
            from: sourceSquare,
            to: targetSquare,
        };
        const cpy = new Chess(game.fen());
        try {
            if (cpy.move(move) != null) {
                setGame(cpy);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
        }

        evaluatePosition(game.fen());
    }

    return (
        <div>
            <Chessboard position={game.fen()} onPieceDrop={onDrop} />
        </div>
    );
}
