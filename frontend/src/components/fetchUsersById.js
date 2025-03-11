import getCSRFTokenFromCookies from './token/GetTokenFromCookies';

async function fetchUsersById(userId) {
	const response = await fetch('http://127.0.0.1:8000/usermanagement/fetchUserById', {
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

