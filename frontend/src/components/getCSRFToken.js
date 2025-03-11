async function GetCSRFToken() {
    const response = await fetch(`http://127.0.0.1:8000/usermanagement/csrf`, {
        method: 'GET',
        credentials: 'include', // Important for sending/receiving cookies
    });
    const data = await response.json();
    document.cookie = `csrftoken=${data.csrfToken}; path=/;`;
    return data.csrfToken;
}

export default GetCSRFToken;