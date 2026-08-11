import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import useSession from "./hooks/useSession";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import GrievancePage from "./pages/GrievancePage";

function App() {
  const [session, setSession] = useSession();

  return (
    <Routes>
      <Route
        path="/"
        element={
          session ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage onAuthenticated={setSession} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          session ? (
            <DashboardPage session={session} onLogout={() => setSession(null)} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/grievance" element={<GrievancePage />} />
    </Routes>
  );
}

export default App;
