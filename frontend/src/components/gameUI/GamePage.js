import React, { useState, useEffect, useRef } from 'react';
import { useGameLogic } from './GameLogic';
import { GameCanvas, GameModeSelection } from './GameUI';
import { GAME_WIDTH, GAME_HEIGHT, PADDLE_HEIGHT, PADDLE_SPEED } from './GameConstants';
import { resetBall } from './GameHelpers';
import { drawGame } from './drawGame';

const GamePage = () => {
    const [gameMode, setGameMode] = useState(null);
    const [keys, setKeys] = useState({
        w: false,
        s: false,
        ArrowUp: false,
        ArrowDown: false,
    });
    const [localNetworkId, setLocalNetworkId] = useState('');
    const [joinNetworkId, setJoinNetworkId] = useState('');
    const [networkError, setNetworkError] = useState('');
    const [networkStatus, setNetworkStatus] = useState('');

    const canvasRef = useRef(null);
    const gameLoopRef = useRef(null);
    const keysRef = useRef(keys);

    const { gameState, setGameState, updateGameState } = useGameLogic(gameMode, keysRef);

    // Update keysRef whenever keys change
    useEffect(() => {
        keysRef.current = keys;
    }, [keys]);

    // Handle keyboard inputs
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
                setKeys((prevKeys) => ({ ...prevKeys, [e.key]: true }));
            }
        };

        const handleKeyUp = (e) => {
            if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
                setKeys((prevKeys) => ({ ...prevKeys, [e.key]: false }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Game loop
    useEffect(() => {
        if (gameMode && !gameState.isPaused) {
            gameLoopRef.current = setInterval(() => {
                updateGameState();
            }, 1000 / 60); // 60 FPS
        }

        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
        };
    }, [gameMode, gameState.isPaused, updateGameState]);

    // Draw game on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            drawGame(ctx, gameState);
        }
    }, [gameState]);

    // Start the game with selected mode
    const startGame = (mode) => {
        setGameMode(mode);
        setGameState({
            ball: resetBall(),
            paddle1: { y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
            paddle2: { y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
            score1: 0,
            score2: 0,
            isPaused: true,
        });
    };

    // Toggle pause
    const togglePause = () => {
        setGameState((prevState) => ({
            ...prevState,
            isPaused: !prevState.isPaused,
        }));
    };

    // Connect to network game
    const connectToNetworkGame = () => {
        if (!joinNetworkId.trim()) {
            setNetworkError('Please enter a game ID');
            return;
        }
        setNetworkError('');
        setGameMode('online');
    };

    // Host network game
    const hostNetworkGame = () => {
        setJoinNetworkId('');
        setNetworkError('');
        setGameMode('online');
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
                            <GameCanvas canvasRef={canvasRef} />
                            <div className="mt-3 text-center">
                                <button className="btn btn-secondary" onClick={togglePause}>
                                    {gameState.isPaused ? 'Resume' : 'Pause'}
                                </button>
                            </div>
                            {networkStatus && <p className="text-center mt-3">{networkStatus}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GamePage;