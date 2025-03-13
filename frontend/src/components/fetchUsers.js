import getCSRFTokenFromCookies from './token/GetTokenFromCookies';
import API_URL from './config.js';
async function fetchUsers() {
	const response = await fetch(`${API_URL}/usermanagement/fetchUsers`, {
		method: 'GET',
		headers: {
			'X-CSRFToken': getCSRFTokenFromCookies(),
			'Content-Type': 'application/json'
		},
	})
	const data = await response.json()

	return data;
}

export default GetAllStudents;
