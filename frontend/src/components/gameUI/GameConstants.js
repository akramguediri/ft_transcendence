// src/components/GamePage/GameConstants.js
export const getDefaultConstants = () => ({
    GAME_WIDTH: 800,
    GAME_HEIGHT: 500,
    PADDLE_WIDTH: 15,
    PADDLE_HEIGHT: 100,
    BALL_SIZE: 15,
    PADDLE_SPEED: 8,
    AI_DIFFICULTY: 0.7, // Adjust between 0 and 1 for AI difficulty
    MAX_SCORE: 5,       // New: Score limit
    GAME_DURATION: 90   // New: Game duration in seconds
});