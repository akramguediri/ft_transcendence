import React, { useState, useEffect, useRef } from "react";
import { useGameLogic } from "./GameLogic";
import { GameCanvas, GameModeSelection } from "./GameUI";
import { getDefaultConstants } from "./GameConstants";
import { resetBall } from "./GameHelpers";
import { drawGame } from "./drawGame";
import { useGameSetup } from "./useGameSetup";
import { useNetwork } from "./useNetwork";
import { useGameRecords } from "./useGameRecords";

const GamePage = () => {
    // Initialize hooks in correct order
    const { keys, keysRef, socketRef } = useGameSetup();
    const [gameMode, setGameMode] = useState(null);
    const defaultConstants = getDefaultConstants();
    const [constants, setConstants] = useState(defaultConstants);

    // Game records hook
    const { saveGameRecord } = useGameRecords();

    // Initialize useGameLogic without saveGameRecord
    const { gameState, setGameState, updateGameState, timeLeft } = 
        useGameLogic(gameMode, keysRef, constants);

    // Network hook
    const {
        networkError,
        networkStatus,
        localNetworkId,
        joinNetworkId,
        setLocalNetworkId,
        setJoinNetworkId,
        hostNetworkGame,
        connectToNetworkGame
    } = useNetwork(socketRef, setGameMode, setGameState);

    // Canvas rendering
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");
        drawGame(ctx, gameState, constants);
    }, [gameState, constants]);

    // Game loop
    useEffect(() => {
        if (!gameMode || gameState.isPaused) return;
        
        const interval = setInterval(() => {
            const newState = updateGameState();
            if (gameMode === "online" && socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify(newState));
            }
        }, 1000 / 60);

        return () => clearInterval(interval);
    }, [gameMode, gameState.isPaused, updateGameState]);

    // Game initialization
    const startGame = (mode, settings = {}) => {
        const updatedConstants = { ...defaultConstants, ...settings };
        setConstants(updatedConstants);
        setGameMode(mode);
        setGameState({
            ball: resetBall(updatedConstants),
            paddle1: { y: updatedConstants.GAME_HEIGHT / 2 - updatedConstants.PADDLE_HEIGHT / 2 },
            paddle2: { y: updatedConstants.GAME_HEIGHT / 2 - updatedConstants.PADDLE_HEIGHT / 2 },
            score1: 0,
            score2: 0,
            isPaused: true,
            gameOver: false,
        });
    };

    // Function to handle saving the game record
    const handleSaveGameRecord = () => {
        const gameId = `game-${Date.now()}`;
        saveGameRecord(
            gameState, 
            constants, 
            gameMode, 
            gameId, 
            gameMode === "ai" ? "Player" : "Player 1", 
            gameMode === "ai" ? "AI" : "Player 2"
        );
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    {!gameMode ? (
                        <GameModeSelection
                            startGame={startGame}
                            hostNetworkGame={hostNetworkGame}
                            connectToNetworkGame={connectToNetworkGame}
                            joinNetworkId={joinNetworkId}
                            setJoinNetworkId={setJoinNetworkId}
                            networkError={networkError}
                        />
                    ) : (
                        <div className="game-container">
                            <GameCanvas canvasRef={canvasRef} constants={constants} />
                            <div className="mt-3 text-center">
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
                                >
                                    {gameState.isPaused ? "Resume" : "Pause"}
                                </button>
                                {gameState.gameOver && (
                                    <button 
                                        className="btn btn-primary ms-2" 
                                        onClick={handleSaveGameRecord}
                                    >
                                        Save Game Record
                                    </button>
                                )}
                            </div>
                            {networkStatus && <p className="text-center mt-3">{networkStatus}</p>}
                            {timeLeft > 0 && <p className="text-center mt-3">Time Left: {timeLeft}s</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GamePage;