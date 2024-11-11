import GetCSRFToken from './getCSRFToken';

async function PostData() {

	const response = await fetch('http://127.0.0.1:8000/api/', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'X-CSRFToken': await GetCSRFToken(),
			'Content-Type': 'application/json'
		},
	})
	const data = await response.json()

	return data;
}

export default PostData;
