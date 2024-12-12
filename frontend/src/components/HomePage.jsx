import React from 'react';
import { useEffect, useState } from 'react';
import UpdateName from './updateData';
import logoutUser from './logoutUser';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [userName, setUserName] = useState('');
  const [newName, setNewName] = useState('');
  const [message, setMessage] = useState('');
  const [fetchedUser, setFetchedUser] = useState(null); // State to store fetched user data
  const [userId, setUserId] = useState(''); // State for user ID input
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
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

  const handleFetchUserById = async () => {
    if (!userId.trim()) {
      alert('User ID cannot be empty.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/usermanagement/fetchUserById', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setFetchedUser(data.data.user);
        alert('User fetched successfully!');
      } else {
        alert(data.msg || 'Failed to fetch user.');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      alert('Error fetching user.');
    }
  };

  return (
    <div>
      <h1>HomePage</h1>
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
      <div className="mt-4">
        <h2>Fetch User By ID</h2>
        <input
          type="text"
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="form-control mb-2"
        />
        <button onClick={handleFetchUserById} className="btn btn-info">
          Fetch User
        </button>
        {fetchedUser && (
          <div className="mt-3">
            <h3>User Details:</h3>
            <p><strong>ID:</strong> {fetchedUser.id}</p>
            <p><strong>Name:</strong> {fetchedUser.name}</p>
            <p><strong>Description:</strong> {fetchedUser.description}</p>
            <p><strong>Avatar:</strong> {fetchedUser.avatar}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
