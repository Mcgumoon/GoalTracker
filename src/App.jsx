import { Routes, Route, Navigate } from "react-router-dom";
import Shell from "./components/Shell";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";

import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";
import CompletedHistory from "./pages/CompletedHistory";

import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* ---------- Public (no Shell) ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ---------- Private (Shell + Protected) ---------- */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Shell>
              <Dashboard />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Shell>
              <Settings />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/completed-goal-history"
        element={
          <ProtectedRoute>
            <Shell>
              <CompletedHistory />
            </Shell>
          </ProtectedRoute>
        } />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <Shell>
              <ChangePassword />
            </Shell>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
