import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import { AuthProvider } from "Components/auth/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
