import React, { useEffect, useState } from 'react';
import UpdateName from '../updateData';
import { Link, useNavigate } from 'react-router-dom';
import { updatePassword } from '../updatePassword';
import getCSRFTokenFromCookies from '../token/GetTokenFromCookies'; // Ensure this is imported
import styles from '../../styles.css';

const Profile = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [newName, setNewName] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [avatarFile, setAvatarFile] = useState(null); // State for the avatar file

    const navigate = useNavigate();

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

    const handleAvatarChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) {
            setMessage({ text: 'Please select an avatar file to upload.', type: 'error' });
            return;
        }
    
        const formData = new FormData();
        formData.append('avatar', avatarFile);
    
        try {
            const response = await fetch('http://127.0.0.1:8000/usermanagement/updateAvatar', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCSRFTokenFromCookies(),
                },
                body: formData,
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Construct the full URL for the new avatar
                const newAvatarUrl = `http://127.0.0.1:8000${data.avatar_url}`;
                
                // Update the state to trigger a re-render
                setUserAvatar(newAvatarUrl);
    
                // Update the local storage with the new avatar URL
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    user.avatar = data.avatar_url; // Store the relative path
                    localStorage.setItem('user', JSON.stringify(user));
                    console.log('Updated user in local storage:', user);
                }
    
                setMessage({ text: 'Avatar updated successfully!', type: 'success' });
            } else {
                setMessage({ text: data.msg || 'Failed to update avatar.', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating avatar:', error);
            setMessage({ text: 'An unexpected error occurred. Please try again.', type: 'error' });
        }
    };
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserName(user.name);
            // Construct the full URL for the avatar
            const avatarUrl = `http://127.0.0.1:8000${user.avatar}`;
            setUserAvatar(avatarUrl);
            console.log('Loaded user from local storage:', user);
        }
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setLoading(true);

        const result = await updatePassword(oldPassword, newPassword, newPasswordConfirm);

        if (result.success) {
            setSuccessMessage('Password updated successfully. Logging out...');
            localStorage.removeItem('user');
            navigate('/login');
        } else {
            setErrorMessage(result.message || 'Failed to update password.');
        }
        setLoading(false);
    };

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
                        />
                        <h1 className="ms-4">Hello, {userName}!</h1>
                    </div>
                    <div className='d-flex gap-4'>
                        <div className="mt-3">
                            <input type="file" onChange={handleAvatarChange} />
                            <button className="btn btn-danger" onClick={handleAvatarUpload}>Change Avatar</button>
                        </div>
                        <div className="mt-3">
                            <Link to='/home-page' className="btn btn-success text-light">Return back to the Home page</Link>
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
                        />
                        <button
                            onClick={handleNameChange}
                            className="btn btn-primary px-4"
                            disabled={!newName.trim()}
                        >
                            Save
                        </button>
                    </div>
                </section>
                {/* Change Password Section */}
                <form onSubmit={handleSubmit} className="mb-4">
                    <h4 className="mb-3">Change Your Password</h4>
                    <div className="d-flex flex-column gap-3">
                        <input
                            type="password"
                            placeholder="Please enter your current password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="form-control"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Please enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-control"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Please Confirm your new password"
                            value={newPasswordConfirm}
                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            className="form-control"
                            required
                        />
                        {errorMessage && <p className="text-danger">{errorMessage}</p>}
                        {successMessage && <p className="text-success">{successMessage}</p>}
                        <button type="submit" className="btn btn-primary btn-password" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>

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
        </div>
    );
};

export default Profile;