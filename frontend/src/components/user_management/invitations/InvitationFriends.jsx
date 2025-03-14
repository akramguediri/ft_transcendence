import React, { useState, useEffect } from 'react';
import addFriend from './AddFriend';
import API_URL from '../../config.js';
const InvitationFriends = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users from your backend
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_URL}/usermanagement/fetchUsers`);
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleAddFriend = (userId) => {
        addFriend(userId);
    };

    return (
        <div className="container mt-5">
            <h2>Send Friend Invitations</h2>
            <ul className="list-group">
                {users.map(user => (
                    <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {user.name}
                        <button onClick={() => handleAddFriend(user.id)} className="btn btn-primary">
                            Add Friend
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InvitationFriends;