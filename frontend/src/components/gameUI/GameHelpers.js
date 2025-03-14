// src/components/GamePage/GameHelpers.js
export const resetBall = (constants) => ({
    x: constants.GAME_WIDTH / 2,
    y: constants.GAME_HEIGHT / 2,
    dx: (Math.random() > 0.5 ? 1 : -1) * 5,
    dy: (Math.random() > 0.5 ? 1 : -1) * 5,
});

export const moveAIPaddle = (paddleY, ballY, constants) => {
    const aiPaddleCenter = paddleY + constants.PADDLE_HEIGHT / 2;
    if (Math.random() < constants.AI_DIFFICULTY) {
        if (aiPaddleCenter < ballY - 10) {
            return paddleY + constants.PADDLE_SPEED;
        } else if (aiPaddleCenter > ballY + 10) {
            return paddleY - constants.PADDLE_SPEED;
        }
    }
    return paddleY;
};

export const checkPaddleCollision = (ball, paddle, isLeftPaddle, constants) => {
    const paddleX = isLeftPaddle ? 0 : constants.GAME_WIDTH - constants.PADDLE_WIDTH;
    const ballRight = ball.x + constants.BALL_SIZE;
    const ballBottom = ball.y + constants.BALL_SIZE;

    return (
        ballRight >= paddleX &&
        ball.x <= paddleX + constants.PADDLE_WIDTH &&
        ballBottom >= paddle.y &&
        ball.y <= paddle.y + constants.PADDLE_HEIGHT
    );
};