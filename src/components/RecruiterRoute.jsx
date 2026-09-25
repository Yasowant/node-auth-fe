import { Navigate, Outlet } from "react-router-dom";

import FullPageMessage from "./FullPageMessage";
import { useAuth } from "../hooks/useAuth";

/** Recruiter-only branch of the protected tree. Anyone else lands on the
 *  board they actually have access to. */
const RecruiterRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <FullPageMessage>Loading...</FullPageMessage>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "RECRUITER") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default RecruiterRoute;
