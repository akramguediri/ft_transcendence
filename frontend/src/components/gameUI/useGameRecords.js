import API_URL from '../config.js';

export const useGameRecords = () => {
    const saveGameRecord = async (gameState, constants, gameMode, gameId, player1, player2) => {
        // Retrieve the authenticated user's data from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.user_name) {
            console.error('Authenticated user data not found in localStorage');
            return;
        }
        // Set player1 to the authenticated user's username
        player1 = userData.user_name;

        // Determine the result, winner, and loser
        const result = `${gameState.score1}-${gameState.score2}`;
        const winner = gameState.score1 > gameState.score2 ? player1 : player2;
        const loser = gameState.score1 > gameState.score2 ? player2 : player1;

        // Prepare the record data
        const record = {
            gameId, // WebSocket game ID
            player1, // Host or User
            player2, // Guest, Player 2, or AI
            result, // Score separated by "-"
            winner, // Winner of the game
            loser, // Loser of the game
            gameMode, // Local, AI, or Online
            settings: {
                ballSize: constants.BALL_SIZE,
                paddleSpeed: constants.PADDLE_SPEED,
                maxScore: constants.MAX_SCORE,
                gameDuration: constants.GAME_DURATION,
            },
            timestamp: new Date().toISOString(),
        };
        try {
            // Retrieve the CSRF token from cookies
            const csrfToken = getCookie("csrftoken");

            // Send the request with the CSRF token and credentials
            const response = await fetch(`${API_URL}/usermanagement/gameRecords`, {
                method: 'POST',
                credentials: 'include', // Include cookies
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken, // Include CSRF token
                },
                body: JSON.stringify(record),
            });

            if (!response.ok) {
                throw new Error('Failed to save game record');
            }
        } catch (error) {
            console.error('Failed to save record:', error);
        }
    };

    // Helper function to get CSRF token from cookies
    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    return { saveGameRecord };
};
