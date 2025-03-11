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
            setFetchedUser(data.data.user);
        } catch (error) {
            setError('Error fetching user.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4 fw-semibold">Fetch User By ID</h2>
    
            {/* Input Group */}
            <div className="input-group mb-3 mx-auto" style={{ maxWidth: "500px" }}>
                <input
                    type="text"
                    placeholder="Enter user ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="form-control"
                />
                <button onClick={handleFetchUserById} className="btn btn-info">
                    Fetch User
                </button>
            </div>
    
            {/* Error Message */}
            {error && <p className="text-danger text-center fw-semibold">{error}</p>}
    
            {/* User Card */}
            {fetchedUser && (
                <div className="card shadow-sm mt-4 mx-auto border-0 rounded-3" style={{ maxWidth: "500px" }}>
                    <div className="d-flex align-items-center p-3">
                        <img
                            src={fetchedUser.avatar}
                            alt="User Avatar"
                            className="rounded-circle border"
                            style={{ width: "90px", height: "90px", objectFit: "cover" }}
                        />
                        <div className="ms-3">
                            <h4 className="fw-semibold text-dark mb-1">{fetchedUser.name}</h4>
                            <p className="mb-1"><strong>ID:</strong> {fetchedUser.id}</p>
                            <p className="text-muted mb-0"><strong>Description:</strong> {fetchedUser.description || 'No description available'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    
};

export default FetchUserById;