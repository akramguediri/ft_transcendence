import { useEffect, useState } from 'react';
import UpdateNameComponent from './UpdateName';
import FetchUserById from './FetchUserById';
import UpdatePassword from './UpdatePassword';

const Profile = () => {
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserName(user.name);
            setUserAvatar(`http://127.0.0.1:8000/media/${user.avatar}`);
        }
    }, []);

    return (
        <div className="container mt-5 text-center">
            <h1>HomePage </h1>
            <img
                src={userAvatar}
                alt="User Avatar"
                style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '15px',
                }}
                onError={(e) => (e.target.src = '/default-avatar.png')} // Fallback if image fails to load
            />
            <h1>Hello, {userName}!</h1>
            <div> <UpdateNameComponent setUserName={setUserName} /> </div>
            <div> <FetchUserById /> </div>
            <div> <UpdatePassword /> </div>
        </div>
    );
};

export default Profile;
