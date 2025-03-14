import getCSRFTokenFromCookies from './token/GetTokenFromCookies';
import API_URL from './config.js';
async function GetStudent(arg) {
	const response = await fetch(`${API_URL}api/getStudent`, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({
				name : arg,
			}),
		headers: {
			'X-CSRFToken': getCSRFTokenFromCookies(),
			'Content-Type': 'application/json'
		},
	})
	const data = await response.json()

	return data;
}

export default GetStudent;
