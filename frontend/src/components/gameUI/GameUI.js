import React from 'react';
import {
    GAME_WIDTH,
    GAME_HEIGHT,
    PADDLE_HEIGHT,
    PADDLE_WIDTH,
    BALL_SIZE,
} from './GameConstants';

export const GameCanvas = ({ canvasRef }) => {
    return (
        <canvas
            ref={canvasRef}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            className="bg-dark rounded"
        />
    );
};

export const GameModeSelection = ({ startGame, hostNetworkGame, connectToNetworkGame, joinNetworkId, setJoinNetworkId, networkError }) => (
    <div className="game-modes p-4 bg-dark text-white rounded">
        <h2 className="text-center mb-4">Select Game Mode</h2>
        <div className="d-grid gap-3">
            <button className="btn btn-primary" onClick={() => startGame('local')}>
                2 Players (Local)
            </button>
            <button className="btn btn-success" onClick={() => startGame('ai')}>
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
    </div>
);