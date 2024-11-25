import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        setError(''); // Clear any previous errors

        if (!user_name || !password) {
            setError('Please fill in all required fields.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/usermanagement/login?user_name=${user_name}&password=${password}`, {
                method: 'GET',
                credentials: 'include',
            });            
            console.log('Response:', response);
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.msg || 'Failed to login. Please try again.');
                // throw new Error(errorData.msg);
                return;
            }

            const data = await response.json();
            if(data.status === 'success'){
                localStorage.setItem("user", JSON.stringify(data.user));
                alert('Login successful!');
                console.log('User data:', data);
                // Redirect to the home page or dashboard
                navigate('/home-page'); // Uncomment if using react-router
                return data;
            } else {
                const errorData = await response.json();
                setError(errorData.msg || 'Failed to login. Please try again.');
                // throw new Error(errorData.msg);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-start" style={{ minHeight: '100vh', marginTop: '8rem' }}>
            <form onSubmit={handleFormSubmit} className="mb-4 p-4 shadow rounded" style={{ width: '300px' }}>
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
                        <Link to="/" className="text-blue-600 underline">Log in</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginUser;
