import getCSRFTokenFromCookies from './token/GetTokenFromCookies';
import API_URL from './config.js';
async function UpdateName({name, new_name}) {
	const response = await fetch(`${API_URL}/usermanagement/updateName`, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({
				name : name,
				new_name : new_name,
			}),
		headers: {
			'X-CSRFToken': getCSRFTokenFromCookies(),
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
