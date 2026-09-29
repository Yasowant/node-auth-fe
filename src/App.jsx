import { BrowserRouter, Route, Routes } from "react-router-dom";

import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import RecruiterRoute from "./components/RecruiterRoute";
import { AuthProvider } from "./context/AuthContext";
import Admin from "./pages/Admin";
import CompanyForm from "./pages/CompanyForm";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import JobForm from "./pages/JobForm";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Register from "./pages/Register";
import Applications from "./pages/Applications";
import Assistant from "./pages/Assistant";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public marketing page -- works signed in or out. */}
          <Route path="/" element={<Landing />} />

          {/* Signed-in users get bounced away from these. */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/assistant" element={<Assistant />} />

            {/* Admins get the user directory; everyone else is sent back. */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>

            {/* Recruiters get their own console; everyone else is sent back. */}
            <Route element={<RecruiterRoute />}>
              <Route path="/recruiter" element={<RecruiterDashboard />} />
              <Route path="/recruiter/company" element={<CompanyForm />} />
              <Route path="/recruiter/jobs/new" element={<JobForm />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
