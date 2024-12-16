import React, { useState } from 'react';
import updateNameAPI from '../updateData';
const UpdateNameComponent = ({ setUserName }) => {

    const [newName, setNewName] = useState('');
    const [message, setMessage] = useState('');

    const handleNameChange = async () => {
        if (!newName.trim()) {
            setMessage('Name cannot be empty.');
            return;
        }

        const response = await updateNameAPI({ new_name: newName });
        if (response.status === 'success') {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                user.name = newName;
                localStorage.setItem('user', JSON.stringify(user));
            }
            setUserName(newName);
            setMessage('Name updated successfully!');
            setNewName('');
        } else {
            setMessage(response.msg || 'Failed to update name.');
        }
    };

    return (
        <div>

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
                    disabled={!newName.trim()}
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
        </div>
    );
};

export default UpdateNameComponent;