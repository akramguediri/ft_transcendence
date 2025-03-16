import getCSRFTokenFromCookies from "../../token/GetTokenFromCookies";
import API_URL from '../../config.js';
const addFriend = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/usermanagement/addfriend`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': getCSRFTokenFromCookies(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Friend added successfully!');
        } else {
            alert(data.msg || 'Failed to add friend.');
        }
    } catch (error) {
        alert('An unexpected error occurred.');
    }
};

export default addFriend;
