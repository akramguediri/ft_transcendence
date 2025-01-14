import React from 'react'
import { Navigate } from 'react-router-dom';

const SecureRoute = ({children}) => {
    const isAuthenticated = !!localStorage.getItem('user'); // Check if user is authenticated
  return isAuthenticated ? children : <Navigate to = '/login' /> // Redirect to login page if not authenticated
}

export default SecureRoute