import { createBrowserRouter } from "react-router-dom";
import HomePage from "../components/HomePage";
import UserRegistry from "../components/user_management/UserRegistry";
import LoginUser from "../components/user_management/LoginUser";
import Profile from "../components/user_management/Profile";
import InvitationFriends from "../components/user_management/InvitationFriends";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <UserRegistry />,
    },
    {
        path: 'home-page',
        element: <HomePage />,
    },
    {
        path: 'login',
        element: <LoginUser />,
    },
    {
        path: 'user-profile',
        element: <Profile />,
    },
    {
        path: 'invitation',
        element: <InvitationFriends />,
    }
]);