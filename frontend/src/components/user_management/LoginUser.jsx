import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import getCSRFTokenFromCookies from '../token/GetTokenFromCookies';
import API_URL from '../config.js';
const LoginUser = () => {
    const [user_name, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!user_name || !password) {
            setError('Please fill in all required fields.');
            return;
        }
    
        setLoading(true);
        try {
            const dt = {
                user_name,
                password,
            };
            const response = await fetch(`${API_URL}/usermanagement/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCSRFTokenFromCookies(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dt),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem("user", JSON.stringify(data.user));
                alert('Login successful!');
                navigate('/home-page');
            } else {
                setError(data.msg || 'Failed to login. Please try again.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An unexpected error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-light vh-100">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <section className="col-lg-9 position-relative h-100">
                        <img
                            alt=""
                            src="https://media.licdn.com/dms/image/sync/v2/D5627AQHS230WxZg8uw/articleshare-shrink_800/articleshare-shrink_800/0/1719412234289?e=2147483647&v=beta&t=rJh_BmQ6SfGeUZXFDV0isgpYiqjRt5HOO3UTpXNYUJQ"
                            className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover opacity-80"
                        />

                        <div className="p-4 text-white position-relative z-index-1 h-100 m-auto">
                            <h2 className="mt-6 text-2xl font-bold">Welcome to our ft_transcendence Project</h2>
                        </div>
                    </section>
                    <div className="col-lg-3 d-flex align-items-center">
                        <form onSubmit={handleFormSubmit} className="p-4 shadow rounded bg-white w-100">
                            <div className="mb-3">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={user_name}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="form-control form-control-sm"
                                />
                            </div>
                            <div className="mb-3 position-relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control form-control-sm"
                                />
                                <span
                                    className="position-absolute top-50 end-0 translate-middle-y px-2"
                                    onClick={togglePasswordVisibility}
                                    style={{ cursor: "pointer" }}
                                >
                                    {showPassword ? (
                                        <svg
                                            viewBox="0 0 1024 1024"
                                            fill="currentColor"
                                            height="1em"
                                            width="1em"
                                        >
                                            <path d="M396 512a112 112 0 10224 0 112 112 0 10-224 0zm546.2-25.8C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM508 688c-97.2 0-176-78.8-176-176s78.8-176 176-176 176 78.8 176 176-78.8 176-176 176z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            viewBox="0 0 1024 1024"
                                            fill="currentColor"
                                            height="1em"
                                            width="1em"
                                        >
                                            <path d="M508 624a112 112 0 00112-112c0-3.28-.15-6.53-.43-9.74L498.26 623.57c3.21.28 6.45.43 9.74.43zm370.72-458.44L836 122.88a8 8 0 00-11.31 0L715.37 232.23Q624.91 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.7 119.43 136.55 191.45L112.56 835a8 8 0 000 11.31L155.25 889a8 8 0 0011.31 0l712.16-712.12a8 8 0 000-11.32zM332 512a176 176 0 01258.88-155.28l-48.62 48.62a112.08 112.08 0 00-140.92 140.92l-48.62 48.62A175.09 175.09 0 01332 512z" />
                                            <path d="M942.2 486.2Q889.4 375 816.51 304.85L672.37 449A176.08 176.08 0 01445 676.37L322.74 798.63Q407.82 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5z" />
                                        </svg>
                                    )}
                                </span>
                            </div>

                            {error && <p className="text-danger small">{error}</p>}

                            <button
                                type="submit"
                                className="btn btn-primary btn-sm w-100 mb-3"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                            <div>
                                <p className="small mt-2 mx-1 text-black">
                                    Don't have an account?{" "}
                                    <Link to="/" className="text-blue-600 underline">Register</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginUser;