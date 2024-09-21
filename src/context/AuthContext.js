import React, { createContext, useState, useEffect, useContext } from 'react';

// Create Context
const AuthContext = createContext();

// Create Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

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

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for using AuthContext
export const useAuth = () => useContext(AuthContext);
export default AuthContext;