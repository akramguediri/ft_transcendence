import React, { useState } from 'react';
import GetCSRFToken from '../getCSRFToken';

const FetchUserById = () => {
    const [fetchedUser, setFetchedUser] = useState(null);
    const [userId, setUserId] = useState('');

    const handleFetchUserById = async () => {
        if (!userId.trim()) {
            alert('User ID cannot be empty.');
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:8000/usermanagement/fetchUserById', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': await GetCSRFToken(),
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
    );
};

export default FetchUserById;