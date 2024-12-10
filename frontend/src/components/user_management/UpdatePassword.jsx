import React, { useState } from 'react';
import { updatePassword } from '../updatePassword'; // Adjust the path as needed

const UpdatePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setLoading(true);

        const result = await updatePassword(oldPassword, newPassword, newPasswordConfirm);

        if (result.success) {
            setSuccessMessage(result.message);
        } else {
            setErrorMessage(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <form onSubmit={handleSubmit} className="p-4 shadow rounded" style={{ width: '400px' }}>
                <h4 className="mb-4">Update Password</h4>

                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm New Password"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        required
                    />
                </div>

                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                {successMessage && <p className="text-success">{successMessage}</p>}

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
};

export default UpdatePassword;
