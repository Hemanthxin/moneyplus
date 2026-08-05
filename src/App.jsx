import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import useSession from "./hooks/useSession";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

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
    </Routes>
  );
}

export default App;
