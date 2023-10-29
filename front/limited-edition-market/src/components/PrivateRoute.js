// PrivateRoute.js

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function PrivateRoute({ isLoggedIn, handleOpenLoginModal }) {
  const navigate = useNavigate();
  
  if (!isLoggedIn) {
    handleOpenLoginModal();
    navigate("/"); // Redirect to the homepage (or login page if you have one)
  }
  
  return <Outlet />;
}

export default PrivateRoute;
