import React, { useEffect, useState } from 'react';
import UpdateName from '../updateData';
import { Link } from 'react-router-dom';
import styles from '../../styles.css'
import UpdateNameComponent from './UpdateName';
import FetchUserById from './FetchUserById';
import UpdatePassword from './UpdatePassword';

const Profile = () => {
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [newName, setNewName] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' }); // To handle success or error states
    const [userId, setUserId] = useState('');
    const [fetchedUser, setFetchedUser] = useState(null);
    const [newPassword, setNewPassword] = useState(''); // Add state for new password

    const handleNameChange = async () => {
        if (!newName.trim()) {
            setMessage({ text: 'Name cannot be empty.', type: 'error' });
            return;
        }

        try {
            const response = await UpdateName({ new_name: newName.trim() });
            if (response.status === 'success') {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    user.name = newName.trim();
                    localStorage.setItem('user', JSON.stringify(user));
                }
                setUserName(newName.trim());
                setMessage({ text: 'Name updated successfully!', type: 'success' });
                setNewName('');
            } else {
                setMessage({ text: response.msg || 'Failed to update name.', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating name:', error);
            setMessage({ text: 'An unexpected error occurred. Please try again.', type: 'error' });
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


    const handlePasswordChange = async () => {
        console.log('Password change handler');
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserName(user.name || 'Guest');
            setUserAvatar(user.avatar ? `http://127.0.0.1:8000/media/${user.avatar}` : '/default-avatar.png'); // Fallback avatar
        }
    }, []);

    return (
        <div className="container mt-5">
        <div className="border shadow-lg rounded p-4">
            {/* Avatar and Greeting Section */}
            <section className="mb-4">
                <div className="d-flex justify-content-start align-items-center">
                    <img
                        src={userAvatar}
                        id='profile-avatar'
                        alt="User Avatar"
                        className="profile-avatar"
                        onError={(e) => (e.target.src = '/default-avatar.png')} // Fallback if image fails to load
                    />
                    <h1 className="ms-4">Hello, {userName}!</h1>
                </div>
                <div className='d-flex gap-4'>
                    <div className="mt-3">
                        <button className="btn btn-danger">Change Avatar</button>
                    </div>
                    <div className="mt-3">
                        <Link to='/home-page' className="btn btn-success text-light">return back to the Home page</Link>
                    </div>
                </div>
            </section>
    
            {/* Update Name Section */}
            <section className="mb-4">
                <h4 className="mb-3">Update Your Name</h4>
                <div className="d-flex gap-3">
                    <input
                        type="text"
                        placeholder="Enter a new name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="form-control"
                        style={{ maxWidth: '300px' }}
                    />
                    <button
                        onClick={handleNameChange}
                        className="btn btn-primary px-4"
                        disabled={!newName.trim()} // Disable button if input is empty
                    >
                        Save
                    </button>
                </div>
            </section>
    
            {/* Change Password Section */}
            <section className="mb-4">
                <h4 className="mb-3">Change Your Password</h4>
                <div className="d-flex gap-3">
                    <input
                        type="password"
                        placeholder="Enter a new password"
                        value={newPassword} // Change `newName` to `newPassword` for clarity
                        onChange={(e) => setNewPassword(e.target.value)} // Add appropriate handler
                        className="form-control"
                        style={{ maxWidth: '300px' }}
                    />
                    <button
                        onClick={handlePasswordChange} // Add appropriate handler
                        className="btn btn-primary px-4"
                        disabled={!newPassword.trim()} // Disable button if input is empty
                    >
                        Save
                    </button>
                </div>
            </section>
    
            {/* Feedback Message */}
            {message.text && (
                <div
                    className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} mt-4`}
                    role="alert"
                >
                    {message.text}
                </div>
            )}
        </div>    
        <div> <UpdateNameComponent setUserName={setUserName} /> </div>
            <div> <FetchUserById /> </div>
            <div> <UpdatePassword /> </div>
        </div>
    );
};

export default Profile;
