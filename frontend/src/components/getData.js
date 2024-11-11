
async function GetData() {
	const response = await fetch('http://127.0.0.1:8000/api/getStudent', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
	})
	const data = await response.json()

	return data;
}

export default GetData;
