import './App.css';
import { useState } from 'react';

async function getData() {

	const response = await fetch('http://127.0.0.1:8000/api/', {
		mode:  'cors',
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			},
	})
	console.log(await response.json());
}

function App() {
	const [ POSTElement, setPOSTElement ] = useState('');
	const [ GETElement, setGETElement ] = useState('GET-Result: ');

	return (
		<div className="App">
			<header className="App-header">

				<div>

					<p> Fetch GET - tester </p>
					<p> <button onClick = { (e) => getData(e) } > GET test</button> </p>
					<p> <button onClick = { (e) => setGETElement('GET-Result: Success!') } > GET </button> </p>
					<p className="fetchResult" > { GETElement } </p>

					<p> Fetch POST - tester </p>
					<input type="text" value= { POSTElement } />
					<input type="button" value="POST" onClick = { (e) => setPOSTElement('POST-Result: Success!') } />

				</div>

			</header>
		</div>
	);
}

export default App;
