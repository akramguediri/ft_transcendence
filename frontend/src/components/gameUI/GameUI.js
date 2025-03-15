// src/components/GamePage/GameUI.js
import React, { useState } from 'react';

export const GameCanvas = ({ canvasRef, constants }) => {
    return (
        <canvas
            ref={canvasRef}
            width={constants.GAME_WIDTH}
            height={constants.GAME_HEIGHT}
            className="bg-dark rounded"
        />
    );
};

export const GameModeSelection = ({ startGame, hostNetworkGame, connectToNetworkGame, joinNetworkId, setJoinNetworkId, networkError }) => {
    // State for game customization
    const [ballSize, setBallSize] = useState(15);
    const [paddleSpeed, setPaddleSpeed] = useState(8);
    const [paddleHeight, setPaddleHeight] = useState(100);
    const [aiDifficulty, setAiDifficulty] = useState(0.7);
    const [maxScore, setMaxScore] = useState(5); // New: Score limit
    const [gameDuration, setGameDuration] = useState(90); // New: Game duration

    const handleStartGame = (mode) => {
        const customSettings = {
            BALL_SIZE: ballSize,
            PADDLE_SPEED: paddleSpeed,
            PADDLE_HEIGHT: paddleHeight,
            AI_DIFFICULTY: aiDifficulty,
            MAX_SCORE: maxScore, // New: Include score limit
            GAME_DURATION: gameDuration // New: Include game duration
        };
        startGame(mode, customSettings);
    };

    return (
        <div className="game-modes p-4 bg-dark text-white rounded">
            <h2 className="text-center mb-4">Select Game Mode</h2>
            <div className="d-grid gap-3">
                <button className="btn btn-primary" onClick={() => handleStartGame('local')}>
                    2 Players (Local)
                </button>
                <button className="btn btn-success" onClick={() => handleStartGame('ai')}>
                    Play Against AI
                </button>
                <button className="btn btn-warning" data-bs-toggle="collapse" data-bs-target="#networkOptions">
                    Play Online (Local Network)
                </button>
                <div className="collapse mt-3" id="networkOptions">
                    <div className="card card-body bg-dark border-light">
                        <div className="mb-3">
                            <button className="btn btn-outline-light w-100" onClick={hostNetworkGame}>
                                Host Game
                            </button>
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Enter Game ID"
                                value={joinNetworkId}
                                onChange={(e) => setJoinNetworkId(e.target.value)}
                            />
                            <button className="btn btn-outline-light w-100" onClick={connectToNetworkGame}>
                                Join Game
                            </button>
                        </div>
                        {networkError && <p className="text-danger text-center">{networkError}</p>}
                    </div>
                </div>
            </div>

            {/* Settings Form */}
            <div className="mt-4">
                <h4 className="text-center mb-3">Game Settings</h4>
                <div className="mb-3">
                    <label className="form-label">Ball Size</label>
                    <input
                        type="number"
                        className="form-control"
                        value={ballSize}
                        onChange={(e) => setBallSize(Number(e.target.value))}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Paddle Speed</label>
                    <input
                        type="number"
                        className="form-control"
                        value={paddleSpeed}
                        onChange={(e) => setPaddleSpeed(Number(e.target.value))}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Paddle Height</label>
                    <input
                        type="number"
                        className="form-control"
                        value={paddleHeight}
                        onChange={(e) => setPaddleHeight(Number(e.target.value))}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">AI Difficulty (0 to 1)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={aiDifficulty}
                        onChange={(e) => setAiDifficulty(Number(e.target.value))}
                        min="0"
                        max="1"
                        step="0.1"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Score Limit</label>
                    <input
                        type="number"
                        className="form-control"
                        value={maxScore}
                        onChange={(e) => setMaxScore(Number(e.target.value))}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Game Duration (seconds)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={gameDuration}
                        onChange={(e) => setGameDuration(Number(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
};