import { useEffect, useState } from 'react';
import UpdateNameComponent from './UpdateName';
import FetchUserById from './FetchUserById';
import UpdatePassword from './UpdatePassword';
import LogoutUser from './LogoutUser';

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
        <div><h1>HomePage </h1>
            <img
                src={userAvatar}
                alt="User Avatar"
                style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                }}
            />
            <h1>Hello, {userName}!</h1>
            <div> <UpdateNameComponent setUserName={setUserName} /> </div>
            {/* <div> <LogoutUser /> </div> */}
            <div> <FetchUserById /> </div>
            <div> <UpdatePassword /> </div>
        </div>
    );
};

export default Profile;
