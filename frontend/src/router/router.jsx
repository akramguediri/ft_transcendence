import { createBrowserRouter } from "react-router-dom";
import HomePage from "../components/HomePage";
import UserRegistry from "../components/user_management/UserRegistry";
import LoginUser from "../components/user_management/LoginUser";


// routing configurations
export const router = createBrowserRouter([
    // Home page
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
    }
]);