// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const parseRoles = (roleString) => {
  if (!roleString) return [];
  if (Array.isArray(roleString)) return roleString.map(r => r.replace("ROLE_", "").trim());
  return roleString
    .replace(/[[\]]/g, "")
    .split(",")
    .map(r => r.replace("ROLE_", "").trim())
    .filter(Boolean);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOtpVerified,   setIsOtpVerified]   = useState(false);
  const [isLoading,       setIsLoading]       = useState(true);
  const [roles,           setRoles]           = useState([]);
  const navigate = useNavigate();

  const isAdmin     = roles.includes("ADMIN");
  const isScientist = roles.includes("SCIENTIST");   // ← ADD

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRoles");
    localStorage.removeItem("isOtpVerified");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    setIsOtpVerified(false);
    setRoles([]);
    navigate("/login", { replace: true });
  }, [navigate]);

  const login = useCallback((token, userName, roleString) => {
    const parsedRoles = parseRoles(roleString);
    localStorage.setItem("token", token);
    localStorage.setItem("userRoles", JSON.stringify(parsedRoles));
    localStorage.setItem("isOtpVerified", "true");
    if (userName) localStorage.setItem("userName", userName);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setIsAuthenticated(true);
    setIsOtpVerified(true);
    setRoles(parsedRoles);
  }, []);

  const verifyOtp = useCallback(() => {
    localStorage.setItem("isOtpVerified", "true");
    setIsOtpVerified(true);
  }, []);

  const isTokenExpired = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000;
    } catch { return true; }
  };

  useEffect(() => {
    const token       = localStorage.getItem("token");
    const otpVerified = localStorage.getItem("isOtpVerified") === "true";
    const savedRoles  = localStorage.getItem("userRoles");
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setIsAuthenticated(true);
        setIsOtpVerified(otpVerified);
        setRoles(savedRoles ? JSON.parse(savedRoles) : []);
      }
    }
    setIsLoading(false);
  }, [logout]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      r => r,
      error => {
        if (error.response?.status === 401) logout();
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [logout]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isOtpVerified,
      isLoading,
      roles,
      isAdmin,
      isScientist,    // ← EXPOSE
      login,
      logout,
      verifyOtp,
    }}>
      {children}
    </AuthContext.Provider>
  );
};