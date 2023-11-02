import { useState, useEffect, useCallback } from 'react';

function useStockfishEngine() {
    const [stockfish, setStockfish] = useState(null);
    const [bestMove, setBestMove] = useState(null);

    useEffect(() => {
        const stockfishWorker = new Worker("./stockfish.js");

        const handleMessage = (e) => {
            const move = e.data?.match(/bestmove\s+(\S+)/)?.[1];
            setBestMove(move);
        };

        stockfishWorker.addEventListener("message", handleMessage);

        stockfishWorker.postMessage("uci");
        stockfishWorker.postMessage("isready");

        setStockfish(stockfishWorker);

        return () => {
            stockfishWorker.postMessage("quit");
            stockfishWorker.removeEventListener("message", handleMessage);
        };
    }, []);

    const sendMessage = useCallback((msg) => {
        stockfish?.postMessage(msg);
    }, [stockfish]);

    const evaluatePosition = useCallback((fen, depth) => {
        sendMessage(`position fen ${fen}`);
        sendMessage(`go depth ${depth}`);
    }, [sendMessage]);

    const stop = useCallback(() => {
        sendMessage("stop");
    }, [sendMessage]);

    return { evaluatePosition, stop, bestMove };
}

export default useStockfishEngine;
