// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    console.log("📌 Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isOtpVerified");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    setIsOtpVerified(false);
    // Use replace to avoid back navigation to protected pages after logout
    navigate("/login", { replace: true });
  }, [navigate]);

  const login = (token, userName) => {
    console.log("📌 Storing new token:", token);
    localStorage.setItem("token", token);
    if (userName) localStorage.setItem("userName", userName);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  const verifyOtp = useCallback(() => {
    console.log("📌 OTP verified. Setting flag.");
    localStorage.setItem("isOtpVerified", "true");
    setIsOtpVerified(true);
  }, []);

  const isTokenExpired = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const otpVerified = localStorage.getItem("isOtpVerified") === "true";
    if (token) {
      if (isTokenExpired(token)) {
        console.log("⛔ Token expired. Logging out...");
        logout();
      } else {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setIsAuthenticated(true);
        setIsOtpVerified(otpVerified);
      }
    }
    setIsLoading(false);
  }, [logout]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.log("⛔ Token expired or unauthorized. Logging out...");
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isOtpVerified, login, logout, verifyOtp, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
