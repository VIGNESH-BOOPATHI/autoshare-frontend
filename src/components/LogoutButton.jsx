import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove JWT token from localStorage
    logout(); // Update context state to reflect the user has logged out
  };

  return <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>;
};

export default LogoutButton;
