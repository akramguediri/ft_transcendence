import getCSRFTokenFromCookies from './token/GetTokenFromCookies';

async function logoutUser() {
    const response = await fetch('http://127.0.0.1:8000/usermanagement/logout', {
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