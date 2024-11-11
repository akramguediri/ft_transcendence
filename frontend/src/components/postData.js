import GetCSRFToken from './getCSRFToken';

async function UpdateStudent(arg) {

	const response = await fetch('http://127.0.0.1:8000/api/updateStudent', {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({
				name : arg,
			}),
		headers: {
			'X-CSRFToken': await GetCSRFToken(),
			'Content-Type': 'application/json'
		},
	})
	const data = await response.json()

	return data;
}

export default UpdateStudent;
