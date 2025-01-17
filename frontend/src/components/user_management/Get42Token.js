import GetCSRFToken from '../getCSRFToken'

const Get42Token = async (code) => {

    try {
        const response = await fetch('http://127.0.0.1:8000/usermanagement/get42token', {
            method: 'POST',
            body: JSON.stringify({ code }),
            headers: {
                'X-CSRFToken': await GetCSRFToken(),
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch token');
        }

        localStorage.setItem('user', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
};

export default Get42Token;
