// AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "Components/auth/Login";
import Signup from "Components/auth/Signup";
import SectionOne from "Components/section/SectionOne";
import SectionTwo from "Components/section/SectionTwo";
import SectionThree from "Components/section/SectionThree";
import SectionFour from "Components/section/SectionFour";
import TechSearch from "Components/pages/techSearch/TechSearch";
import WelcomePage from "Components/pages/welcomePage/WelcomePage";
import PreviewPopUp from "Components/pages/techSearch/PreviewPopUp";
import PrivateRoute from "Components/auth/privateRoute";
import PendingData from "Components/pages/pendingPage/pendingData";
import OTPLoginVerify from "Components/auth/OtpLoginVerify";
import ForgetPassword from "Components/auth/forgetPassword";
import ViewTechnology from "Components/pages/view/viewTechnology";
import TechnologyDetails from "Components/pages/view/TechnologyDetails";
import { useAuth } from "Components/auth/AuthContext";
import ExcelUpload from "Components/excel/ExcelUpload";

// Admin pages
// import AdminDashboard      from "Components/admin/AdminDashboard";
import UserManagement      from "Components/admin/UserManagement";
import TechnologyManagement from "Components/admin/TechnologyManagement";

const AppRoutes = () => {
  const { isOtpVerified, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/"           element={<WelcomePage />} />
      <Route path="/welcomePage" element={<WelcomePage />} />

      {/* Auth — redirect if already logged in */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/welcomePage" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/login" replace /> : <Signup />}
      />

      {/* OTP + password */}
      <Route path="/pendingData" element={<PendingData />} />
      <Route
        path="/otpLoginVerify"
        element={isOtpVerified ? <Navigate to="/welcomePage" replace /> : <OTPLoginVerify />}
      />
      <Route path="/forgetPassword" element={<ForgetPassword />} />

      {/* Dashboard alias */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <WelcomePage /> : <Navigate to="/welcomePage" replace />}
      />

      {/* ViewTechnology (protected) */}
      <Route
        path="/viewTechnology"
        element={<PrivateRoute><ViewTechnology /></PrivateRoute>}
      />
      <Route path="/ViewTechnology" element={<Navigate to="/viewTechnology" replace />} />

      {/* Technology details */}
      <Route
        path="/technology/:trnNo"
        element={<PrivateRoute><TechnologyDetails /></PrivateRoute>}
      />

      {/* Section routes */}
      <Route path="/sectionOne/:technologyRefNo" element={<PrivateRoute><SectionOne /></PrivateRoute>} />
      <Route path="/SectionOne"   element={<PrivateRoute><SectionOne /></PrivateRoute>} />
      <Route path="/SectionTwo"   element={<PrivateRoute><SectionTwo /></PrivateRoute>} />
      <Route path="/SectionThree" element={<PrivateRoute><SectionThree /></PrivateRoute>} />
      <Route path="/SectionFour"  element={<PrivateRoute><SectionFour /></PrivateRoute>} />

      {/* Other protected */}
      <Route path="/techSearch"  element={<PrivateRoute><TechSearch /></PrivateRoute>} />
      <Route path="/PreviewPopUp" element={<PrivateRoute><PreviewPopUp /></PrivateRoute>} />
      <Route path="/ExcelUpload"  element={<PrivateRoute><ExcelUpload /></PrivateRoute>} />

      {/* ── Admin routes ── */}
      {/* <Route path="/admin/dashboard"       element={<PrivateRoute><AdminDashboard /></PrivateRoute>} /> */}
      <Route path="/admin/users"           element={<PrivateRoute><UserManagement /></PrivateRoute>} />
      <Route path="/admin/tech-management" element={<PrivateRoute><TechnologyManagement /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;