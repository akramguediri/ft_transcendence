import getCSRFTokenFromCookies from './token/GetTokenFromCookies';
import API_URL from './config.js';

async function logoutUser() {
    const response = await fetch(`${API_URL}/usermanagement/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'X-CSRFToken': getCSRFTokenFromCookies(),
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    localStorage.removeItem('user');
    return data;
}

export default logoutUser;