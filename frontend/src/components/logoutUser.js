import GetCSRFToken from './getCSRFToken';

async function logoutUser() {
    const response = await fetch('http://127.0.0.1:8000/usermanagement/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'X-CSRFToken': await GetCSRFToken(),
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data;
}

export default logoutUser;