import { createBrowserRouter } from "react-router-dom";
import HomePage from "../components/HomePage";
import UserRegistry from "../components/user_management/UserRegistry";
import LoginUser from "../components/user_management/LoginUser";
import Profile from "../components/user_management/Profile";
import InvitationFriends from "../components/user_management/invitations/InvitationFriends";
import FetchUserById from "../components/user_management/FetchUserById";
import GamePage from "../components/gameUI/GamePage";


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
    },
    {
        path: 'fetch-user',
        element: <FetchUserById />,
    },
    {
        path: 'game',
        element: <GamePage />,
    }
]);