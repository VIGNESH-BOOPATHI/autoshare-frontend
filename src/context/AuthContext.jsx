import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Correct the import statement

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setAuthToken(storedToken);
      setUser(jwtDecode(storedToken)); // Decode JWT to set the user
    }
  }, []);

  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem('authToken', token);
    setUser(jwtDecode(token)); // Decode token to get user info
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;

