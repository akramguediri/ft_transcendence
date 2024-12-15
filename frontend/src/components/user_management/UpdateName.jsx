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
            <input
                type="text"
                placeholder="Enter new name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="form-control mb-2"
            />
            <button onClick={handleNameChange} className="btn btn-primary">
                Update Name
            </button>
            {message && <p className="mt-2">{message}</p>}
        </div>
    );
};

export default UpdateNameComponent;