import React, { useState } from 'react'
import GetCSRFToken from '../getCSRFToken';
import { useNavigate } from 'react-router-dom';

const UserRegistry = () => {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [termAccepted, setTermAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [termInvalid, setTermInvalid] = useState(false);
    const navigate = useNavigate();

    //  Handle terms acceptance checkbox change event 
    const handleTermsChange = () => {
        setTermAccepted(!termAccepted);
        if (termInvalid && termAccepted) {
            setTermInvalid(false); // Clear invalid state if terms are accepted
        }
    };

    // Check if passwords match
    const checkPassword = () => {
        if (password !== repeatPassword) {
            setPasswordError(true);
            setTimeout(() => setPasswordError(false), 3000);
            return false;
        }
        return true;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

         // Validate passwords and terms acceptance
         const isPasswordValid = checkPassword();
         if (!termAccepted) {
             setTermInvalid(true);
         }
         if (!isPasswordValid || !termAccepted) {
             return;
         }
         setLoading(true);
        
        try {
            const data = {
                email,
                password,
                last_name,
                first_name
            };
            const response = await fetch('http://127.0.0.1:8000/api/updateStudent', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data), // Ensure `data` is stringified
                headers: {
                    'X-CSRFToken': await GetCSRFToken(),
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.email === "exists") {
                    setEmailExistsError(true);
                }
                throw new Error('Failed to create user');
            }
            alert('User created successfully!');
            navigate('/home-page');

        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-start"
            style={{ minHeight: '100vh', marginTop: '8rem' }} // Adds more space at the top
        >
            <form onSubmit={handleFormSubmit} className="mb-4 p-4 shadow rounded" style={{ width: '300px' }}>
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                        className="form-control form-control-sm"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                        className="form-control form-control-sm"
                    />
                </div>

                <div className="mb-3 position-relative">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control form-control-sm"
                    />
                    <span className="position-absolute top-50 end-0 translate-middle-y px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-envelope" viewBox="0 0 16 16">
                            <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-.5A.5.5 0 001.5 4v.217l6 3.5 6-3.5V4a.5.5 0 00-.5-.5H2zm13 1.07L8.234 8.4a.5.5 0 01-.468 0L1 4.57V12a.5.5 0 00.5.5h12a.5.5 0 00.5-.5V4.57z" />
                        </svg>
                    </span>
                </div>
                {emailExistsError && <p className="text-danger small">Email already exists. Please log in.</p>}

                <div className="mb-3 position-relative">
                    <input
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control form-control-sm"
                    />
                    <span className="position-absolute top-50 end-0 translate-middle-y px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M8 3.5a5.5 5.5 0 015.5 5.5 5.5 5.5 0 01-11 0A5.5 5.5 0 018 3.5zm0 1A4.5 4.5 0 003.5 9a4.5 4.5 0 109 0A4.5 4.5 0 008 4.5zM8 7a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                    </span>
                </div>

                <div className="mb-3 position-relative">
                    <input
                        type="password"
                        placeholder="Repeat your password"
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        className="form-control form-control-sm"
                    />
                    <span className="position-absolute top-50 end-0 translate-middle-y px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M8 3.5a5.5 5.5 0 015.5 5.5 5.5 5.5 0 01-11 0A5.5 5.5 0 018 3.5zm0 1A4.5 4.5 0 003.5 9a4.5 4.5 0 109 0A4.5 4.5 0 008 4.5zM8 7a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                    </span>
                </div>
                {passwordError && <p className="text-danger small">Passwords do not match.</p>}

                <button
                    type="submit"
                    className="btn btn-primary btn-sm w-100 mb-3"
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Create an Account'}
                </button>

                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        onChange={handleTermsChange}
                        checked={termAccepted}
                        className="form-check-input"
                        id="termsCheckbox"
                    />
                    <label className="form-check-label small" htmlFor="termsCheckbox">
                        I agree to the <a href="#" className="text-primary">Terms & Conditions</a>.
                    </label>
                </div>
                {termInvalid && <p className="text-danger small">Please accept the terms and conditions.</p>}
            </form>
        </div>
    );
};

export default UserRegistry