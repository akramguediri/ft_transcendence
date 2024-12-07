import GetCSRFToken from './getCSRFToken';

async function UpdateName({name, new_name}) {
	const response = await fetch('http://127.0.0.1:8000/usermanagement/updateName', {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({
				name : name,
				new_name : new_name,
			}),
		headers: {
			'X-CSRFToken': await GetCSRFToken(),
			'Content-Type': 'application/json'
		},
	})
	const data = await response.json()


    if (data.status === 'success') {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            user.name = new_name;
            localStorage.setItem('user', JSON.stringify(user));
        }
    }

	return data;
}

export default UpdateName;
