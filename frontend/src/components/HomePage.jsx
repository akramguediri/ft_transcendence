import React from 'react'
import { useEffect, useState } from 'react';
import UpdateName from './updateData';

const HomePage = () => {
  const [userName, setUserName] = useState("");
  const [newName, setNewName] = useState(''); // State for the new name
  const [message, setMessage] = useState(''); // Feedback message

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.name);
    }
  }, []);
  const handleNameChange = async () => {
    if (!newName.trim()) {
        setMessage('Name cannot be empty.');
        return;
    }

    const response = await UpdateName({ new_name: newName });
    if (response.status === 'success') {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            user.name = newName;
            localStorage.setItem('user', JSON.stringify(user));
        }
        setUserName(newName); // Update the UI
        setMessage('Name updated successfully!');
        setNewName(''); // Clear the input
    } else {
        setMessage(response.msg || 'Failed to update name.');
    }
};
  return (
    <div><h1>HomePage </h1>
    <h1>Hello, {userName}!</h1>
    <div>
        <input
            type="text"
            placeholder="Enter new name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="form-control mb-2"
        />
        <button onClick={handleNameChange} className="btn btn-primary">
            Update Name
        </button>
        {message && <p className="mt-2">{message}</p>}
    </div>
    </div>
  )
}

export default HomePage