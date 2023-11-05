import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { validateFen } from 'chess.js'

import Engine from './Engine.js';

const DEPTH = 8;
const FEN_POSITION = 
    "rnbqkb1r/pp1p1ppp/2p2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4";

export default function App() {
    const [game, setGame] = useState(new Chess());
    const [fenInput, setFenInput] = useState("");
    const [evaluation, setEvaluation] = useState();
    const { evaluatePosition, getEval, stop } = Engine();

    useEffect(()=> {

        return ()=> {
            stop();
        }
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
            }
        } catch (error) {
            console.log(error);
            return false;
        }

        evaluatePosition(game.fen());
        return true;
    }

    function handleFenChange(event) {
        setFenInput(event.target.value);
    }

    function setBoardWithFen() {
        const newGame = new Chess(fenInput);
        if (validateFen(fenInput)) {
            setGame(newGame);
        } else {
            console.log("Invalid FEN");
        }
    }

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <div style={{ flex: 1 }}>
                <Chessboard position={game.fen()} onPieceDrop={onDrop} />
            </div>
            <div style={{ flex: 1, padding: "10px" }}>
                <div>
                    <h3>Set Board</h3>
                    <input
                        type="text"
                        value={fenInput}
                        onChange={handleFenChange}
                        placeholder="FEN"
                    />
                    <button onClick={setBoardWithFen}>Set Board</button>
                </div>
                <div>
                    <h3>Evaluation</h3>
                    <p>{getEval()}</p>
                </div>
            </div>
        </div>
    );
}
