import React, { createContext, useState, useEffect, useContext } from 'react';

// Create Context
const AuthContext = createContext();

// Create Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);


  // useEffect to retrieve token from local storage on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // useEffect to store token in local storage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Assuming you get userId during authentication
  const handleLogin = (userData) => {
    setUser(userData);
    setToken(userData.token);
    setUserId(userData.userId); // Set userId when user logs in
  };

  // Add handleLogin to the context value
  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, userId, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
// Custom Hook for using AuthContext
export const useAuth = () => useContext(AuthContext);
export default AuthContext;