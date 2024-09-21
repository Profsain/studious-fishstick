import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, token } = useContext(AuthContext);

  // If no user or token, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, allow access to the route
  return children;
};

export default ProtectedRoute;
