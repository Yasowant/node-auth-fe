import { Navigate, Outlet, useLocation } from "react-router-dom";

import FullPageMessage from "./FullPageMessage";
import { useAuth } from "../hooks/useAuth";

/** Blocks anonymous visitors and remembers where they were headed. */
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageMessage>Loading...</FullPageMessage>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
