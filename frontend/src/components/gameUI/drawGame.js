export const drawGame = (ctx, gameState, constants) => {
    if (!ctx || !gameState) return;

    // Clear canvas
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, constants.GAME_WIDTH, constants.GAME_HEIGHT);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, gameState.paddle1.y, constants.PADDLE_WIDTH, constants.PADDLE_HEIGHT);
    ctx.fillRect(constants.GAME_WIDTH - constants.PADDLE_WIDTH, gameState.paddle2.y, constants.PADDLE_WIDTH, constants.PADDLE_HEIGHT);

    // Draw ball
    ctx.fillRect(gameState.ball.x, gameState.ball.y, constants.BALL_SIZE, constants.BALL_SIZE);

    // Draw scores
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.score1, constants.GAME_WIDTH / 4, 60);
    ctx.fillText(gameState.score2, constants.GAME_WIDTH * 3 / 4, 60);

    // Draw game-over message
    if (gameState.gameOver) {
        ctx.font = '48px Arial';
        ctx.fillStyle = '#ff0000';
        ctx.fillText('Game Over', constants.GAME_WIDTH / 2, constants.GAME_HEIGHT / 2);
    }
};