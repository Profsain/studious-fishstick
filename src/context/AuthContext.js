import React, { createContext, useState, useEffect, useContext } from 'react';

// Create Context
const AuthContext = createContext();

// Create Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Simulate authentication logic
  useEffect(() => {
    // Check user authentication status here
    // Example: setUser({ name: 'John Doe' });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for using AuthContext
export const useAuth = () => useContext(AuthContext);
export default AuthContext;
