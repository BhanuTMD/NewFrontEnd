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
import EditSectionOne from "Components/pages/editForm/editSectionOne";
import EditSectionTwo from "Components/pages/editForm/editSectionTwo";
import EditSectionThree from "Components/pages/editForm/editSectionThree";
import EditSectionFour from "Components/pages/editForm/EditSectionFour";
import OTPLoginVerify from "Components/auth/OtpLoginVerify";
import ForgetPassword from "Components/auth/forgetPassword";
import ViewTechnology from "Components/pages/view/viewTechnology";
import TechnologyDetails from "Components/pages/view/TechnologyDetails";
import { useAuth } from "Components/auth/AuthContext";

const AppRoutes = () => {
  const { isOtpVerified, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public / unprotected */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/welcomePage" element={<WelcomePage />} />

      {/* If user is already authenticated, redirect away from login/signup */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/viewTechnology" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/viewTechnology" replace /> : <Signup />}
      />

      {/* Keep pending/OTP/forget publicly accessible but redirect OTP if already verified */}
      <Route path="/pendingData" element={<PendingData />} />
      <Route
        path="/otpLoginVerify"
        element={isOtpVerified ? <Navigate to="/welcomePage" replace /> : <OTPLoginVerify />}
      />
      <Route path="/forgetPassword" element={<ForgetPassword />} />

      {/* Dashboard alias */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <WelcomePage /> : <Navigate to="/login" replace />}
      />

      {/* ViewTechnology protected */}
      <Route
        path="/viewTechnology"
        element={
          <PrivateRoute>
            <ViewTechnology />
          </PrivateRoute>
        }
      />

      {/* Keep old-cased route for backwards compatibility but redirect to canonical one */}
      <Route path="/ViewTechnology" element={<Navigate to="/viewTechnology" replace />} />

      {/* Technology details (protected if needed) */}
      <Route
        path="/technology/:trnNo"
        element={
          <PrivateRoute>
            <TechnologyDetails />
          </PrivateRoute>
        }
      />

      {/* SectionOne by ref (this might be used for edit/prefill - protect if needed) */}
      <Route
        path="/sectionOne/:technologyRefNo"
        element={
          <PrivateRoute>
            <SectionOne />
          </PrivateRoute>
        }
      />

      {/* Protected pages grouped */}
      <Route
        path="/SectionOne"
        element={
          <PrivateRoute>
            <SectionOne />
          </PrivateRoute>
        }
      />
      <Route
        path="/SectionTwo"
        element={
          <PrivateRoute>
            <SectionTwo />
          </PrivateRoute>
        }
      />
      <Route
        path="/SectionThree"
        element={
          <PrivateRoute>
            <SectionThree />
          </PrivateRoute>
        }
      />
      <Route
        path="/SectionFour"
        element={
          <PrivateRoute>
            <SectionFour />
          </PrivateRoute>
        }
      />
      <Route
        path="/techSearch"
        element={
          <PrivateRoute>
            <TechSearch />
          </PrivateRoute>
        }
      />
      <Route
        path="/PreviewPopUp"
        element={
          <PrivateRoute>
            <PreviewPopUp />
          </PrivateRoute>
        }
      />

      {/* Edit routes */}
      <Route
        path="/editSectionOne"
        element={
          <PrivateRoute>
            <EditSectionOne />
          </PrivateRoute>
        }
      />
      <Route
        path="/editSectionTwo"
        element={
          <PrivateRoute>
            <EditSectionTwo />
          </PrivateRoute>
        }
      />
      <Route
        path="/editSectionThree"
        element={
          <PrivateRoute>
            <EditSectionThree />
          </PrivateRoute>
        }
      />
      <Route
        path="/editSectionFour"
        element={
          <PrivateRoute>
            <EditSectionFour />
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
