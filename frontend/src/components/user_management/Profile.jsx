import React, { useEffect, useState } from 'react';
import UpdateName from '../updateData';
import { Link, useNavigate } from 'react-router-dom';
import { updatePassword } from '../updatePassword';
import getCSRFTokenFromCookies from '../token/GetTokenFromCookies';
import FetchUserById from './FetchUserById';

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
    const [avatarFile, setAvatarFile] = useState(null);
    const [showFetchUser, setShowFetchUser] = useState(false);

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
                const newAvatarUrl = `http://127.0.0.1:8000${data.avatar_url}`;
                setUserAvatar(newAvatarUrl);

                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    user.avatar = data.avatar_url;
                    localStorage.setItem('user', JSON.stringify(user));
                }

                setMessage({ text: 'Avatar updated successfully!', type: 'success' });
            } else {
                setMessage({ text: data.msg || 'Failed to update avatar.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'An unexpected error occurred. Please try again.', type: 'error' });
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log("user :", user);
        if (user) {
            setUserName(user.name);
            const avatarUrl = user.avatar ? `http://127.0.0.1:8000${user.avatar}` : 'http://127.0.0.1:8000/media/Avatars/default-avatar.png';
            setUserAvatar(avatarUrl);
            console.log("avatar icon: ", avatarUrl);
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
            <div className="card shadow-lg border-0 rounded-4 p-4">
                <section className="mb-4">
                    <div className="row align-items-start g-4">
                        {/* Avatar Section */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm">
                                <img
                                    src={userAvatar}
                                    alt="User Avatar"
                                    className="card-img-top rounded-top"
                                    style={{ height: "350px", objectFit: "cover" }}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title text-dark fw-semibold">Hello, {userName}!</h5>
                                    <input type="file" onChange={handleAvatarChange} className="form-control mt-3" />
                                    <div className="d-grid gap-2 mt-3">
                                        <button className="btn btn-danger" onClick={handleAvatarUpload}>
                                            Change Avatar
                                        </button>
                                        <Link to='/home-page' className="btn btn-success">
                                            Home
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Info & Forms */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm p-4">
                                {/* Number of Friends */}
                                <div className="mb-4 text-center">
                                    <h3 className="fw-semibold">Number of Friends</h3>
                                    <p className="fs-4 text-primary">1</p>
                                </div>

                                {/* Update Name */}
                                <div className="mb-4">
                                    <h4 className="fw-semibold">Update Your Name</h4>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            placeholder="Enter a new name"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="form-control"
                                        />
                                        <button
                                            onClick={handleNameChange}
                                            className="btn btn-primary"
                                            disabled={!newName.trim()}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>

                                {/* Change Password */}
                                <form onSubmit={handleSubmit}>
                                    <h4 className="fw-semibold">Change Your Password</h4>
                                    <div className="mb-3">
                                        <input
                                            type="password"
                                            placeholder="Current password"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="password"
                                            placeholder="New password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={newPasswordConfirm}
                                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    {/* Feedback Messages */}
                                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                                    {successMessage && <p className="text-success">{successMessage}</p>}

                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>

                                {/* Alert Message */}
                                {message.text && (
                                    <div className={`alert mt-4 ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                                        {message.text}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* List of Friends */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm p-4">
                                <h3 className="fw-semibold mb-3">List of Friends</h3>
                                <ul className="list-group">
                                    List
                                    {/* {friendsList.length > 0 ? (
                                        friendsList.map((friend, index) => (
                                            <li key={index} className="list-group-item">
                                                {friend.name}
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-muted">No friends added yet.</p>
                                    )} */}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Toggle Fetch User */}
                <div className="text-center mt-4">
                    <button onClick={() => setShowFetchUser(!showFetchUser)} className="btn btn-info">
                        {showFetchUser ? 'Hide User Lookup' : 'Show User Lookup'}
                    </button>
                </div>

                {showFetchUser && <FetchUserById />}
            </div>
        </div>
    );

};

export default Profile;