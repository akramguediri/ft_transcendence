import getCSRFTokenFromCookies from '../token/GetTokenFromCookies';
import API_URL from '../config.js';
const Get42Token = async (code) => {
    try {
        const response = await fetch(`${API_URL}usermanagement/get42token`, {
            method: 'POST',
            body: JSON.stringify({ code }),
            headers: {
                'X-CSRFToken': getCSRFTokenFromCookies(),
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Ensures cookies are sent
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch token');
        }

        const data = await response.json();
        console.log("Token Data:", data);

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Error fetching token:', error.message);
        throw error;
    }
};

export default Get42Token;