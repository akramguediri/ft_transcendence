import React, { useEffect, useState } from 'react';
import UpdateName from '../updateData';

const Profile = () => {
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [newName, setNewName] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' }); // To handle success or error states
    const [userId, setUserId] = useState('');
    const [fetchedUser, setFetchedUser] = useState(null);

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

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserName(user.name || 'Guest');
            setUserAvatar(user.avatar ? `http://127.0.0.1:8000/media/${user.avatar}` : '/default-avatar.png'); // Fallback avatar
        }
    }, []);

    return (
        <div className="container mt-5 text-center">
            {/* User Avatar */}
            <img
                src={userAvatar}
                alt="User Avatar"
                style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '15px',
                }}
                onError={(e) => (e.target.src = '/default-avatar.png')} // Fallback if image fails to load
            />
            <h1>Hello, {userName}!</h1>

            {/* Update Name Form */}
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Enter new name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="form-control mb-2"
                    style={{ maxWidth: '300px', margin: '0 auto' }}
                />
                <button
                    onClick={handleNameChange}
                    className="btn btn-primary"
                    disabled={!newName.trim()} // Disable button if input is empty
                >
                    Update Name
                </button>
            </div>

            {/* Feedback Message */}
            {message.text && (
                <p
                    className={`mt-3 ${message.type === 'success' ? 'text-success' : 'text-danger'}`}
                    style={{ fontWeight: 'bold' }}
                >
                    {message.text}
                </p>
            )}

            <section>
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
                        <div className="card mt-3" style={{ maxWidth: '400px', margin: 'auto' }}>
                            <div className="card-body text-center">
                                <img
                                    src={`http://127.0.0.1:8000/media/${fetchedUser.avatar}`}
                                    alt="User Avatar"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginBottom: '15px',
                                    }}
                                    onError={(e) => (e.target.src = '/default-avatar.png')}
                                />
                                <h4 className="card-title">{fetchedUser.name}</h4>
                                <p className="card-text"><strong>ID:</strong> {fetchedUser.id}</p>
                                <p className="card-text"><strong>Description:</strong> {fetchedUser.description}</p>
                            </div>
                        </div>
                    )}

                </div>
            </section>
        </div>
    );
};

export default Profile;
