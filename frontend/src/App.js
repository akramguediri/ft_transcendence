import './App.css';
import GetStudent from './components/getData'
import UpdateStudent from './components/postData'
import UpdateName from './components/updateData'
import GetAllStudents from './components/getAllStudents'
import { useState } from 'react';

function App() {
	const [ data, setData ] = useState([]);
	const [ message, setMessage ] = useState([]);
	const [currentName, setCurrentName] = useState('');
	const [newName, setNewName] = useState('');

	async function updateData() {
		if (currentName && newName) {
		  const resp = await UpdateName({ name: currentName, new_name: newName });
		  setData(resp);
		} else {
		  alert('Please provide both current and new names');
		}
	  }
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

			<button onClick = { () => getAll() }> 
				GET all Students
			</button> 
				<div>
					<input className="getForm"
						onChange = { (e) => setMessage(e.target.value) }
					/>

					<button onClick = { () => getData(message) }> 
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
					<input
						className="getForm"
						placeholder="Enter current name"
						onChange={(e) => setCurrentName(e.target.value)}
					/>

					<input
						className="getForm"
						placeholder="Enter new name"
						onChange={(e) => setNewName(e.target.value)}
					/>

					<button onClick={updateData}>  {}
						Update Name
					</button>
					</div>

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
