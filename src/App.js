import React from "react";
import AppRoutes from "./Routes";
import { AuthProvider } from "Components/auth/AuthContext";

function App() {
  return (
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
  );
}

export default App;
