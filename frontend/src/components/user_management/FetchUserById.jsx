import React, { useState } from 'react';
import fetchUsersById from '../fetchUsersById';

const FetchUserById = () => {
    const [fetchedUser, setFetchedUser] = useState(null);
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    const handleFetchUserById = async () => {
        if (!userId.trim()) {
            setError('User ID cannot be empty.');
            return;
        }
        try {
            const response = await fetchUsersById(userId);
            if (response.status !== 'success') {
                setError(response.msg || 'Error fetching user.');
                return;
            }
            const data = response.data;
            if (data.status === 'success') {
                setFetchedUser(data.data.user);
            } else {
                setError(data.msg || 'Error fetching user.');
            }
        } catch (error) {
            setError('Error fetching user.');
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
            {error && <p className="text-danger small">{error}</p>}
            {fetchedUser && (
                <div className="card mt-3" style={{ maxWidth: '400px', margin: 'auto' }}>
                    <div className="card-body text-center">
                        <h3>User Details:</h3>
                        <p><strong>ID:</strong> {fetchedUser.id}</p>
                        <p><strong>Name:</strong> {fetchedUser.name}</p>
                        <p><strong>Description:</strong> {fetchedUser.description}</p>
                        <p>{fetchedUser.avatar}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FetchUserById;
