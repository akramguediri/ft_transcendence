import getCSRFTokenFromCookies from './token/GetTokenFromCookies';
import API_URL from './config.js';
async function fetchUsersById(userId) {
	const response = await fetch(`${API_URL}/usermanagement/fetchUserById`, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({
			user_id: userId,
		}),
		headers: {
			'X-CSRFToken': getCSRFTokenFromCookies(),
			'Content-Type': 'application/json',
		},
	});
	const data = await response.json();
	if (data.status !== 'success') {
		return { status: 'error', msg: data.msg || 'Failed to fetch user.' };
	}
	return { status: 'success', data };
}

export default fetchUsersById;

