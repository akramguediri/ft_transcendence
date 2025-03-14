// src/components/GamePage/GameLogic.js
import { useState, useEffect, useRef } from 'react';
import {
    GAME_WIDTH,
    GAME_HEIGHT,
    PADDLE_HEIGHT,
    BALL_SIZE,
    PADDLE_SPEED,
} from './GameConstants';
import { resetBall, moveAIPaddle, checkPaddleCollision } from './GameHelpers';

export const useGameLogic = (gameMode, keysRef) => {
    const [gameState, setGameState] = useState({
        ball: resetBall(),
        paddle1: { y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
        paddle2: { y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
        score1: 0,
        score2: 0,
        isPaused: true,
    });

    const updateGameState = () => {
        setGameState((prevState) => {
            const newState = { ...prevState };

            // Move paddles
            if (gameMode === 'local' || gameMode === 'ai') {
                // Left paddle (Player 1)
                if (keysRef.current.w && newState.paddle1.y > 0) {
                    newState.paddle1.y -= PADDLE_SPEED;
                }
                if (keysRef.current.s && newState.paddle1.y < GAME_HEIGHT - PADDLE_HEIGHT) {
                    newState.paddle1.y += PADDLE_SPEED;
                }

                // Right paddle (Player 2 or AI)
                if (gameMode === 'local') {
                    if (keysRef.current.ArrowUp && newState.paddle2.y > 0) {
                        newState.paddle2.y -= PADDLE_SPEED;
                    }
                    if (keysRef.current.ArrowDown && newState.paddle2.y < GAME_HEIGHT - PADDLE_HEIGHT) {
                        newState.paddle2.y += PADDLE_SPEED;
                    }
                } else if (gameMode === 'ai') {
                    newState.paddle2.y = moveAIPaddle(newState.paddle2.y, newState.ball.y);
                }
            }

            // Move the ball
            newState.ball.x += newState.ball.dx;
            newState.ball.y += newState.ball.dy;

            // Ball collision with top and bottom
            if (newState.ball.y <= 0 || newState.ball.y >= GAME_HEIGHT - BALL_SIZE) {
                newState.ball.dy = -newState.ball.dy;
            }

            // Ball collision with paddles
            if (checkPaddleCollision(newState.ball, newState.paddle1, true)) {
                newState.ball.dx = Math.abs(newState.ball.dx);
            }
            if (checkPaddleCollision(newState.ball, newState.paddle2, false)) {
                newState.ball.dx = -Math.abs(newState.ball.dx);
            }

            // Score - ball goes past paddles
            if (newState.ball.x <= 0) {
                newState.score2 += 1;
                newState.ball = resetBall();
            } else if (newState.ball.x >= GAME_WIDTH - BALL_SIZE) {
                newState.score1 += 1;
                newState.ball = resetBall();
            }

            return newState;
        });
    };

    return { gameState, setGameState, updateGameState };
};