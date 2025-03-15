import React, { useEffect, useState } from 'react';
import UpdateName from '../updateData';
import { Link, useNavigate } from 'react-router-dom';
import { updatePassword } from '../updatePassword';
import getCSRFTokenFromCookies from '../token/GetTokenFromCookies';
import FetchUserById from './FetchUserById';
import API_URL from '../config.js';

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
    const [activeTab, setActiveTab] = useState("status");
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(false);
    const [loadingFriendRequests, setLoadingFriendRequests] = useState(false);

    const navigate = useNavigate();

    // function for fetch Friend Requests
    const fetchFriendRequests = async () => {
        setLoadingFriendRequests(true);
        try {
            const response = await fetch(`${API_URL}/usermanagement/fetchfriendrequests`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCSRFTokenFromCookies(),
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch friend requests');
            }
    
            const data = await response.json();
            setFriendRequests(data.data.requests);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        } finally {
            setLoadingFriendRequests(false);
        }
    };


    // function to accept requests from friend

    const acceptRequest = async (requestId) => {
        try {
            const response = await fetch(`${API_URL}/usermanagement/acceptfriendrequest`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCSRFTokenFromCookies(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ request_id: requestId }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to accept request');
            }
    
            const data = await response.json();
            alert('Friend request accepted');
            fetchFriendRequests(); // Refresh the list
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    // const acceptRequest = async (requestId) => {
    //     try {
    //         const response = await fetch('http://127.0.0.1:8000/usermanagement/acceptfriendrequest', {
    //             method: 'POST',
    //             credentials: 'include',
    //             headers: {
    //                 'X-CSRFToken': getCSRFTokenFromCookies(),
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ request_id: requestId }),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to accept request');
    //         }

    //         const data = await response.json();
    //         alert('Friend request accepted');
    //         fetchFriendRequests(); // Refresh the list
    //     } catch (error) {
    //         console.error('Error accepting friend request:', error);
    //     }
    // };

    // function to reject requests from friend
    const rejectRequest = async (requestId) => {
        try {
            const response = await fetch(`${API_URL}/usermanagement/rejectFriendRequest`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCSRFTokenFromCookies(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ request_id: requestId }),
            });
            const data = await response.json();
            if (data.status === 'success') {
                alert('Friend request rejected');
                fetchFriendRequests(); // Refresh the list
            } else {
                alert(data.msg || 'Failed to reject request');
            }
        } catch (error) {
            alert('An unexpected error occurred');
        }
    };


    // function for fetch user friends
    const fetchFriends = async () => {
        setLoadingFriends(true);
        try {
            const response = await fetch(`${API_URL}/usermanagement/fetchuserfriends`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCSRFTokenFromCookies(),
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch friends');
            }
    
            const data = await response.json();
            setFriends(data.data.friends);
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoadingFriends(false);
        }
    };
    


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

        // Check if the file is an image
        if (!avatarFile.type.startsWith('image/')) {
            setMessage({ text: 'Please upload a valid image file.', type: 'error' });
            return;
        }

        const formData = new FormData();
        formData.append('avatar', avatarFile);

        try {
            const response = await fetch(`${API_URL}/usermanagement/updateAvatar`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCSRFTokenFromCookies(),
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                const newAvatarUrl = `${API_URL}${data.avatar_url}`;
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
        if (user) {
            setUserName(user.name);
            const avatarUrl = user.avatar ? `${API_URL}${user.avatar}` : `${API_URL}/media/Avatars/default-avatar.png`;
            setUserAvatar(avatarUrl);
        }
        fetchFriends();
        fetchFriendRequests();
    }, []); // dependencies

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
        <div className="container mt-5 bg-secondary p-2">
            {/*  section for picture and content */}
            <section>
                <div className="card mb-3" >
                    <div className="row g-0">
                        <div className="col-lg-3 border">
                            <img
                                src={userAvatar}
                                className="img-fluid rounded-start"
                                alt="User Avatar"
                            />
                            <div className='card'>
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
                        <div className="col-lg-5">
                            <h5 className="card-title text-dark fw-semibold mx-auto">
                                Hello, {userName}!
                            </h5>
                            <div className="card text-center">
                                <div className="card-header">
                                    <ul className="nav nav-pills card-header-pills">
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === "status" ? "active" : ""}`}
                                                onClick={() => setActiveTab("status")}
                                            >
                                                Status
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === "friends" ? "active" : ""}`}
                                                onClick={() => setActiveTab("friends")}
                                            >
                                                Friend List
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === "modify" ? "active" : ""}`}
                                                onClick={() => setActiveTab("modify")}
                                            >
                                                Modify your Name
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === "change password" ? "active" : ""}`}
                                                onClick={() => setActiveTab("change password")} // Fix the typo here
                                            >
                                                Change Password
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card-body">
                                    {activeTab === "status" ? (
                                        <h5 className="card-title">Online</h5>
                                    ) : activeTab === "friends" ? (
                                        <div className="text-center text-secondary">
                                            <h3 className="fw-semibold mb-3 text-secondary">Friend List</h3>
                                            <div className="table-responsive">
                                                <table className="table table-striped table-bordered align-middle">
                                                    <thead className="table-dark">
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">Name</th>
                                                            <th scope="col">Description</th>
                                                            <th scope="col">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {friends.map((friend, index) => (
                                                            <tr key={friend.id}>
                                                                <th scope="row">{index + 1}</th>
                                                                <td>{friend.name}</td>
                                                                <td>{friend.description || 'No description'}</td>
                                                                <td>{/* Add logic to display online status */}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="table-responsive mt-5 text-secondary">
                                                <h3 className="fw-semibold mb-3 text-secondary">Friend Requests</h3>
                                                <table className="table table-striped table-bordered align-middle">
                                                    <thead className="table-dark">
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">Name</th>
                                                            <th scope="col">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {friendRequests.map((request, index) => (
                                                            <tr key={request.id}>
                                                                <th scope="row">{index + 1}</th>
                                                                <td>{request.name}</td>
                                                                <td>
                                                                    <button onClick={() => acceptRequest(request.id)} className="btn btn-success btn-sm me-2">Accept</button>
                                                                    <button onClick={() => rejectRequest(request.id)} className="btn btn-danger btn-sm">Reject</button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                    ) : activeTab === "modify" ? (
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
                                    ) : (
                                        // Change Password
                                        <form onSubmit={handleSubmit}>
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
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div className="card border-primary mb-3 bg-dark">
                                <div className="card-header text-white text-center">Achievement</div>
                                <div className="card-body text-white">
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trophy" viewBox="0 0 16 16">
                                                <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z" />
                                            </svg>
                                            <h5 className="card-title">3 Wins</h5>
                                        </div>
                                        <div >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-emoji-frown" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
                                            </svg>
                                            <h5 className="card-title">5 Loses</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card shadow-lg border-0 rounded-4 p-4">
                                {/* Toggle Fetch User */}
                                <div className="text-center mt-4">
                                    <button onClick={() => setShowFetchUser(!showFetchUser)} className="btn btn-info">
                                        {showFetchUser ? 'Hide User Lookup' : 'Show User Lookup'}
                                    </button>
                                </div>
                                {showFetchUser && <FetchUserById />}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='mt-5'>
                <div className='card bg-dark'>
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Game ID</th>
                                <th scope="col">Player 1</th>
                                <th scope="col">Player 2</th>
                                <th scope="col">Result</th>
                                <th scope="col">Winner</th>
                                <th scope="col">Loser</th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider">
                            <tr>
                                <th scope="row">1</th>
                                <td>1</td>
                                <td>Ali</td>
                                <td>Moussa</td>
                                <td>3 - 2</td>
                                <td>Ali</td>
                                <td>Moussa</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );

};

export default Profile;