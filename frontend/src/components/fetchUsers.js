import getCSRFTokenFromCookies from './token/GetTokenFromCookies';

async function fetchUsers() {
	const response = await fetch('http://127.0.0.1:8000/usermanagement/fetchUsers', {
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
