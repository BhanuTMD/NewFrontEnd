import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // Ya spinner bhi dikha sakta hai

  return isAuthenticated ? children : <Navigate to="/Login" />;
};

export default PrivateRoute;
