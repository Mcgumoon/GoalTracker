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

import Groups from "./pages/Groups";
import GroupDetail from "./components/groups/GroupDetail";
import GroupLeaderboard from "./components/groups/GroupLeaderboard";
import GroupSettings from "./components/groups/GroupSettings";

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
      {/* Groups list */}
      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <Shell>
              <Groups />
            </Shell>
          </ProtectedRoute>
        }
      />

      {/* Group detail */}
      <Route
        path="/groups/:groupId"
        element={
          <ProtectedRoute>
            <Shell>
              <GroupDetail />
            </Shell>
          </ProtectedRoute>
        }
      />

      {/* Group leaderboard */}
      <Route
        path="/groups/:groupId/leaderboard"
        element={
          <ProtectedRoute>
            <Shell>
              <GroupLeaderboard />
            </Shell>
          </ProtectedRoute>
        }
      />

      {/* Admin settings */}
      <Route
        path="/groups/:groupId/settings"
        element={
          <ProtectedRoute>
            <Shell>
              <GroupSettings />
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
