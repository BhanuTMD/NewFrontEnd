import React from "react";
import { Routes, Route } from "react-router-dom";
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="welcomePage" element={<WelcomePage />} />
      <Route path="signup" element={<Signup />} />
      <Route path="Login" element={<Login />} />
      <Route path="pendingData" element={<PendingData />} />
      <Route path="otpLoginVerify" element={<OTPLoginVerify />} />
      <Route path="forgetPassword" element={<ForgetPassword />} />

      {/* Protected Routes */}
      <Route
        path="SectionOne"
        element={
          <PrivateRoute>
            <SectionOne />
          </PrivateRoute>
        }
      />
      <Route
        path="SectionTwo"
        element={
          <PrivateRoute>
            <SectionTwo />
          </PrivateRoute>
        }
      />
      <Route
        path="SectionThree"
        element={
          <PrivateRoute>
            <SectionThree />
          </PrivateRoute>
        }
      />
      <Route
        path="SectionFour"
        element={
          <PrivateRoute>
            <SectionFour />
          </PrivateRoute>
        }
      />
      <Route
        path="techSearch"
        element={
          <PrivateRoute>
            <TechSearch />
          </PrivateRoute>
        }
      />
      <Route
        path="PreviewPopUp"
        element={
          <PrivateRoute>
            <PreviewPopUp />
          </PrivateRoute>
        }
      />
      <Route
  path="editSectionOne"
  element={
    <PrivateRoute>
      <EditSectionOne />
    </PrivateRoute>
  }
/>
<Route
  path="editSectionTwo"
  element={
    <PrivateRoute>
      <EditSectionTwo />
    </PrivateRoute>
  }
/>
<Route
  path="editSectionThree"
  element={
    <PrivateRoute>
      <EditSectionThree />
    </PrivateRoute>
  }
/>
<Route
  path="editSectionFour"
  element={
    <PrivateRoute>
      <EditSectionFour />
    </PrivateRoute>
  }
/>
      <Route
        path="EditSectionOne"
        element={
          <PrivateRoute>
            <EditSectionOne />
          </PrivateRoute>
        }
      />
      <Route
        path="EditSectionTwo"
        element={
          <PrivateRoute>
            <EditSectionTwo />
          </PrivateRoute>
        }
      />
      <Route
        path="EditSectionThree"
        element={
          <PrivateRoute>
            <EditSectionThree />
          </PrivateRoute>
        }
      />
      <Route
        path="EditSectionFour"
        element={
          <PrivateRoute>
            <EditSectionFour />
          </PrivateRoute>
        }
      />
    </Routes> 
  );
};

export default AppRoutes;
