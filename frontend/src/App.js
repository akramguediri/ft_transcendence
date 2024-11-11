import './App.css';
import GetStudent from './components/getData'
import UpdateStudent from './components/postData'
import GetAllStudents from './components/getAllStudents'
import { useState } from 'react';

function App() {
	const [ data, setData ] = useState([]);
	const [ message, setMessage ] = useState([]);

	async function getAll() {
		const resp  = await GetAllStudents();
		setData(resp);
	}

	async function getData(e) {
		const resp  = await GetStudent(e);
		setData(resp);
	}

	async function postData(e) {
		const resp  = await UpdateStudent(e);
		setData(resp);
	}

	return (
		<div className="App">
			<header className="App-header">

			<button onClick = { (e) => getAll() }> 
				GET all Students
			</button> 
				<div>
					<input className="getForm"
						onChange = { (e) => setMessage(e.target.value) }
					/>

					<button onClick = { (e) => getData(message) }> 
						GET 
					</button> 

					<div>
					</div>

					<input className="postForm"
						onChange = { (e) => setMessage(e.target.value) }
					/>

					<button onClick = { 
						(e) => 
						postData(message) 
					}> 
						POST 
					</button> 

					<div>
						{Object.entries(data).map(([key, value]) => (
							<div>
								<ul>{value}</ul>
							</div>
						))}
					</div>
				</div>
			</header>
		</div>
	);
}

export default App;
