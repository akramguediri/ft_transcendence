import { useState, useEffect } from "react";
import { resetBall, moveAIPaddle, checkPaddleCollision } from "./GameHelpers";

export const useGameLogic = (gameMode, keysRef, constants) => {
    const [gameState, setGameState] = useState({
        ball: resetBall(constants),
        paddle1: { y: constants.GAME_HEIGHT / 2 - constants.PADDLE_HEIGHT / 2 },
        paddle2: { y: constants.GAME_HEIGHT / 2 - constants.PADDLE_HEIGHT / 2 },
        score1: 0,
        score2: 0,
        isPaused: true,
        gameOver: false,
    });

    const [timeLeft, setTimeLeft] = useState(constants.GAME_DURATION || 90);

    // Timer logic
    useEffect(() => {
        if (!gameState.isPaused && !gameState.gameOver && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000); // Update every second

            return () => clearInterval(timer); // Cleanup on unmount or state change
        }
    }, [gameState.isPaused, gameState.gameOver, timeLeft]);

    // Check for game over conditions
    useEffect(() => {
        if (timeLeft <= 0 || gameState.score1 >= constants.MAX_SCORE || gameState.score2 >= constants.MAX_SCORE) {
            setGameState((prevState) => ({
                ...prevState,
                gameOver: true,
            }));
        }
    }, [timeLeft, gameState.score1, gameState.score2, constants.MAX_SCORE]);

    // Handle paddle movement
    const handlePaddleMovement = (newState, gameMode, keysRef, constants) => {
        if (gameMode === "local" || gameMode === "ai") {
            // Player 1 paddle movement (W and S keys)
            if (keysRef.current.w && newState.paddle1.y > 0) {
                newState.paddle1.y -= constants.PADDLE_SPEED;
            }
            if (keysRef.current.s && newState.paddle1.y < constants.GAME_HEIGHT - constants.PADDLE_HEIGHT) {
                newState.paddle1.y += constants.PADDLE_SPEED;
            }

            // Player 2 or AI paddle movement
            if (gameMode === "local") {
                // Player 2 paddle movement (ArrowUp and ArrowDown keys)
                if (keysRef.current.ArrowUp && newState.paddle2.y > 0) {
                    newState.paddle2.y -= constants.PADDLE_SPEED;
                }
                if (keysRef.current.ArrowDown && newState.paddle2.y < constants.GAME_HEIGHT - constants.PADDLE_HEIGHT) {
                    newState.paddle2.y += constants.PADDLE_SPEED;
                }
            } else if (gameMode === "ai") {
                // AI paddle movement
                newState.paddle2.y = moveAIPaddle(newState.paddle2.y, newState.ball.y, constants);
            }
        }
    };

    // Handle ball collision with walls
    const handleBallWallCollision = (newState, constants) => {
        if (newState.ball.y <= 0 || newState.ball.y >= constants.GAME_HEIGHT - constants.BALL_SIZE) {
            newState.ball.dy = -newState.ball.dy; // Reverse the ball's vertical direction
        }
    };

    // Handle ball collision with paddles
    const handleBallPaddleCollision = (newState, constants) => {
        // Check collision with Player 1 paddle (left paddle)
        if (checkPaddleCollision(newState.ball, newState.paddle1, true, constants)) {
            newState.ball.dx = Math.abs(newState.ball.dx); // Ball moves to the right
        }
        // Check collision with Player 2 or AI paddle (right paddle)
        if (checkPaddleCollision(newState.ball, newState.paddle2, false, constants)) {
            newState.ball.dx = -Math.abs(newState.ball.dx); // Ball moves to the left
        }
    };

    // Handle scoring
    const handleScoring = (newState, constants) => {
        if (newState.ball.x <= 0) {
            newState.score2 += 1;
            if (newState.score2 >= constants.MAX_SCORE) {
                newState.gameOver = true;
            }
            newState.ball = resetBall(constants);
        } else if (newState.ball.x >= constants.GAME_WIDTH - constants.BALL_SIZE) {
            newState.score1 += 1;
            if (newState.score1 >= constants.MAX_SCORE) {
                newState.gameOver = true;
            }
            newState.ball = resetBall(constants);
        }
    };

    // Update game state on each frame
    const updateGameState = () => {
        setGameState((prevState) => {
            if (prevState.gameOver || prevState.isPaused) return prevState;

            const newState = { ...prevState };

            // Handle paddle movement
            handlePaddleMovement(newState, gameMode, keysRef, constants);

            // Update ball position
            newState.ball.x += newState.ball.dx;
            newState.ball.y += newState.ball.dy;

            // Handle collisions
            handleBallWallCollision(newState, constants);
            handleBallPaddleCollision(newState, constants);

            // Handle scoring
            handleScoring(newState, constants);

            return newState;
        });
    };

    return { gameState, setGameState, updateGameState, timeLeft };
};