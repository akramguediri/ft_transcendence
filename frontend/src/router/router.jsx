import { createBrowserRouter } from "react-router-dom";
import HomePage from "../components/HomePage";
import UserRegistry from "../components/user_management/UserRegistry";


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
    }
]);