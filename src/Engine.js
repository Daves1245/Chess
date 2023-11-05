import { useState, useEffect, useCallback } from 'react';

// Wrapper around stockfish
function Engine() {
    const [stockfish, setStockfish] = useState();
    const [fen, setFen] = useState();
    const [data, setData] = useState();
    const [bestMove, setBestMove] = useState();
    const [evaluation, setEvaluation] = useState();

    const handleMessage = (e) => {
        setData(e["data"]);
        // TODO parser would be nice but overkill
        const bm_regex = /best move (\S+)/;
        const eval_regex = /score cp (-?\d+)/;

        const bm_match = e["data"].match(bm_regex);
        const eval_match = e["data"].match(eval_regex);

        if (bm_match) {
            console.log("Found best move: ", bm_match);
        }

        if (eval_match) {
            console.log("eval: ", eval_match[1]);
        }

        // console.log("[debug] e[data]: ", e["data"]);
    }

    const getEval = ()=> {
        return evaluation;
    }

    useEffect(() => {
        const stockfishWorker = new Worker("./stockfish.js");

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
    }, [stockfish]);

    const stop = useCallback(() => {
        sendMessage("stop");
    }, [sendMessage]);

    return { evaluatePosition, getEval, stop };
}

export default Engine;
