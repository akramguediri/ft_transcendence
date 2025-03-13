import API_URL from './config.js';

async function GetCSRFToken() {
    const response = await fetch(`${API_URL}/usermanagement/csrf`, {
        method: 'GET',
        credentials: 'include', // Important for sending/receiving cookies
    });
    const data = await response.json();
    document.cookie = `csrftoken=${data.csrfToken}; path=/;`;
    return data.csrfToken;
}

export default GetCSRFToken;