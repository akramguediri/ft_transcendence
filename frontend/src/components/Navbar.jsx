import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import LogoutUser from './user_management/LogoutUser';

const Navbar = () => {
    // const navigate = useNavigate();

    // const handleLogout = async () => {
    //     try {
    //         const response = await logoutUser();
    //         if (response.status === 'success') {
    //             localStorage.removeItem('user');
    //             alert(response.msg);
    //             navigate('/login');
    //         } else {
    //             alert(response.msg || 'Failed to log out');
    //         }
    //     } catch (error) {
    //         console.error('Error logging out:', error);
    //         alert('An unexpected error occurred during logout.');
    //     }
    // };

    return (
        <nav className="navbar navbar-expand-md bg-light navbar-light fixed-top">
            <div className="container">
                <a className="navbar-brand fw-bold" href="/index.html">
                    <span className="bg-primary bg-gradient p-1 rounded-3 text-light">ft_</span>transcendence
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/home-page">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/user-profile">Profile</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/game">Game</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/invitation">Invitation</Link>
                        </li>
                        {/* <li className="nav-item">
                            <button onClick={handleLogout} className="btn">Logout</button>
                        </li> */}
                        <li className="nav-item">
                            <LogoutUser />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar
