import React, { useState } from 'react';

const InvitationFriends = () => {
    const [users, setUsers] = useState([
        { id: 1, username: 'user1', email: 'user1@example.com' },
        { id: 2, username: 'user2', email: 'user2@example.com' },
        { id: 3, username: 'user3', email: 'user3@example.com' },
    ]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '' });

    // Handle select/deselect user
    const handleSelectUser = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
        );
    };

    // Handle delete selected users
    const handleDeleteUsers = () => {
        setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)));
        setSelectedUsers([]); // Clear selection
    };

    // Handle add new user
    const handleAddUser = () => {
        if (!newUser.username || !newUser.email) {
            alert('Please provide both username and email!');
            return;
        }
        setUsers((prev) => [
            ...prev,
            { id: prev.length + 1, username: newUser.username, email: newUser.email },
        ]);
        setNewUser({ username: '', email: '' });
        setShowModal(false); // Close modal
    };

    // Handle select all users
    const handleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]); // Deselect all
        } else {
            setSelectedUsers(users.map((user) => user.id)); // Select all
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-primary text-center mb-4">Invitation Friends</h1>
            <div className="mb-3">
                <button
                    className="btn btn-secondary me-2"
                    onClick={handleDeleteUsers}
                    disabled={selectedUsers.length === 0}
                >
                    - Delete
                </button>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    + Add User
                </button>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th className="bg-dark text-light">
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedUsers.length === users.length && users.length > 0}
                            />
                        </th>
                        <th className="bg-dark text-light">ID User</th>
                        <th className="bg-dark text-light">Username</th>
                        <th className="bg-dark text-light">Email</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleSelectUser(user.id)}
                                />
                            </td>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Add User Modal */}
            {showModal && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add User</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newUser.username}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, username: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={newUser.email}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, email: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAddUser}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvitationFriends;
