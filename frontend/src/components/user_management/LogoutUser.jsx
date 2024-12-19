import React from 'react';
import logoutUser from '../logoutUser';
import { useNavigate } from 'react-router-dom';
const LogoutUser = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            if (response.status === 'success') {
                localStorage.removeItem('user');
                alert(response.msg);
                navigate('/login');
            } else {
                alert(response.msg || 'Failed to log out');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
    );
};

export default LogoutUser;