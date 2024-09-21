import React, { createContext, useState, useEffect, useContext } from 'react';

// Create Context
const AuthContext = createContext();

// Create Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for using AuthContext
export const useAuth = () => useContext(AuthContext);
export default AuthContext;
