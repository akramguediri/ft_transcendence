import './App.css';
import GetData from './components/getData'
import PostData from './components/postData'
import { useState, useEffect } from 'react';

function App() {
	const [ data, setData ] = useState([]);

	async function getData() {
		const resp  = await GetData();
		setData(resp);
	}

	async function postData() {
		const resp  = await PostData();
		setData(resp);
	}

	return (
		<div className="App">
			<header className="App-header">

				<div>
						<button onClick = { (e) => getData(e) }> 
							GET 
						</button> 
						<div>
							Message:   
							{ data.message } 
						</div>
						<button onClick = { (e) => postData(e) }> 
							POST 
						</button> 
						<div>
							Message:   
							{ data.message } 
						</div>
				</div>

			</header>
		</div>
	);
}

export default App;
