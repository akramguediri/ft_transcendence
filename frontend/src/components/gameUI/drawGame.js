import {
    GAME_WIDTH,
    GAME_HEIGHT,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    BALL_SIZE,
} from './GameConstants';

export const drawGame = (ctx, gameState) => {
    if (!ctx || !gameState) return; // Add a check for undefined gameState

    // Clear canvas
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, gameState.paddle1.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH, gameState.paddle2.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillRect(gameState.ball.x, gameState.ball.y, BALL_SIZE, BALL_SIZE);

    // Draw scores
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.score1, GAME_WIDTH / 4, 60);
    ctx.fillText(gameState.score2, GAME_WIDTH * 3 / 4, 60);
};