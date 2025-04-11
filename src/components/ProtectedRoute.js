import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from './../SessionManager';

function ProtectedRoute({ children }) {
  const session = getSession();
  
  // If the session doesn't exist, redirect to the login page
  if (!session) {
    return <Navigate to="/login" />;
  }
  
  // If the session exists, render the children (protected content)
  return children;
}

export default ProtectedRoute;
