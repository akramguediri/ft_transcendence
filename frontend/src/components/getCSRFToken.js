
async function GetCSRFToken() {

		const response = await fetch(`http://127.0.0.1:8000/usermanagement/csrf`, {
			method: 'GET',
		});
		const data = await response.json();
		document.cookie = "csrftoken=" + data.csrfToken;
	return data.csrfToken;
}

export default GetCSRFToken;
