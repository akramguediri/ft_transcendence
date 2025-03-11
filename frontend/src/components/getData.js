import getCSRFTokenFromCookies from './token/GetTokenFromCookies';

async function GetStudent(arg) {
	const response = await fetch('http://127.0.0.1:8000/api/getStudent', {
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
