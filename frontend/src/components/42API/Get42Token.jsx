import getCSRFTokenFromCookies from '../token/GetTokenFromCookies';
import API_URL from '../config.js';
const Get42UserInfo = async (accessToken) => {

    try {
        const response = await fetch(`${API_URL}/usermanagement/get42UserInfo`, {
            method: 'POST',
            body: JSON.stringify({ access_token: accessToken }),
            headers: {
                'X-CSRFToken': getCSRFTokenFromCookies(),
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            credentials: 'include',
        })

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response from backend:", errorData);
            throw new Error(errorData.error || 'Failed to fetch user info');
        }

        const userData = await response.json();
        // console.log("User Data:", userData);

        // Store the user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        // console.log("Stored User Data in localStorage:", localStorage.getItem('user'));

        return userData;
    } catch (error) {
        console.error('Error fetching user info:', error.message);
        throw error;
    }
};

const Get42Token = async (code) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/usermanagement/get42token', {
            method: 'POST',
            body: JSON.stringify({ code }),
            headers: {
                'X-CSRFToken': getCSRFTokenFromCookies(),
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            // console.error("Error response from backend:", errorData);
            throw new Error(errorData.error || 'Failed to fetch token');
        }

        const data = await response.json();
        // console.log("Full response from backend:", data);
        // console.log("Extracted access token:", data.access_token);

        if (!data.access_token) {
            console.error("ERROR: No access token received!");
            return;
        }

        Get42UserInfo(data.access_token);

        return data;
    } catch (error) {
        console.error('Error fetching token:', error.message);
        throw error;
    }
};


export default Get42Token;
