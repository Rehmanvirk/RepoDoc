// frontend/src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// This is a "wrapper" component
// It checks for a user, and if one exists, it renders
// the 'children' components. Otherwise, it navigates to /login.

function PrivateRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the component they were trying to access
  return children;
}

export default PrivateRoute;