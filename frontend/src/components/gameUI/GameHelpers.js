import {
    GAME_WIDTH,
    GAME_HEIGHT,
    PADDLE_HEIGHT,
    PADDLE_WIDTH,
    BALL_SIZE,
    PADDLE_SPEED,
    AI_DIFFICULTY,
} from './GameConstants';

// Reset ball to center
export const resetBall = () => ({
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    dx: (Math.random() > 0.5 ? 1 : -1) * 5,
    dy: (Math.random() > 0.5 ? 1 : -1) * 5,
});

// AI movement logic
export const moveAIPaddle = (paddleY, ballY) => {
    const aiPaddleCenter = paddleY + PADDLE_HEIGHT / 2;
    if (Math.random() < AI_DIFFICULTY) {
        if (aiPaddleCenter < ballY - 10) {
            return paddleY + PADDLE_SPEED;
        } else if (aiPaddleCenter > ballY + 10) {
            return paddleY - PADDLE_SPEED;
        }
    }
    return paddleY;
};

// Check ball collision with paddles
export const checkPaddleCollision = (ball, paddle, isLeftPaddle) => {
    const paddleX = isLeftPaddle ? 0 : GAME_WIDTH - PADDLE_WIDTH;
    const ballRight = ball.x + BALL_SIZE;
    const ballBottom = ball.y + BALL_SIZE;

    return (
        ballRight >= paddleX &&
        ball.x <= paddleX + PADDLE_WIDTH &&
        ballBottom >= paddle.y &&
        ball.y <= paddle.y + PADDLE_HEIGHT
    );
};