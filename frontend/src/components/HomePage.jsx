import React from 'react'
import { useEffect, useState } from 'react';
import UpdateName from './updateData';
import logoutUser from './logoutUser';
import { useNavigate } from 'react-router-dom';
import UpdatePassword from './user_management/UpdatePassword';

const HomePage = () => {
  const [userName, setUserName] = useState("");
  const [newName, setNewName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();



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
        setUserName(newName);
        setMessage('Name updated successfully!');
        setNewName('');
    } else {
        setMessage(response.msg || 'Failed to update name.');
    }
  };


    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            if (response.status === 'success') {
                localStorage.removeItem('user');
                alert(response.msg);
                navigate('/login');
            } else {
                alert(response.msg || 'Failed to log out');
            }
        } catch (error) {
            console.error('Error logging out:', error);
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
      <div>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
      <div> <UpdatePassword /></div>
    </div>
  )
}

export default HomePage