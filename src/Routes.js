// src/Routes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "Components/auth/Login";
import  {AuthProvider } from "Components/auth/AuthContext";
import Signup from "Components/auth/Signup";
import SectionOne from "Components/section/SectionOne";
import SectionTwo from "Components/section/SectionTwo";
import SectionThree from "Components/section/SectionThree";
import SectionFour from "Components/section/SectionFour";
import TechSearch from "Components/pages/techSearch/TechSearch";
import ChangePassword from "Components/auth/ChangePassword";
import WelcomePage from "Components/pages/welcomePage/WelcomePage";
import OTPVerify from "Components/auth/OtpVerify";
import OTPLoginVerify from "Components/auth/OtpLoginVerify";
import PreviewPopUp from "Components/pages/techSearch/PreviewPopUp";

const AppRoutes = () => {
  return (
      <AuthProvider> {/* ✅ Wrap everything here */}
    <Routes>
      <Route path="/">
        <Route index element={<WelcomePage />} />
        <Route path="welcomePage" element={<WelcomePage />} />
        <Route path="signup" element={<Signup />} />
        <Route path="SectionOne" element={<SectionOne />} />
        <Route path="SectionTwo" element={<SectionTwo />} />
        <Route path="SectionThree" element={<SectionThree />} />
        <Route path="SectionFour" element={<SectionFour />} />
        <Route path="changePassword" element={<ChangePassword />} />
        <Route path="otpVerify" element={<OTPVerify />} />
        <Route path="otpLoginVerify" element={<OTPLoginVerify />} />
        <Route path="Login" element={<Login />} />
        <Route path="techSearch" element={<TechSearch />} />
        <Route path="PreviewPopUp" element={<PreviewPopUp />} />
      </Route>
    </Routes>
     </AuthProvider>
  );
};

export default AppRoutes;
