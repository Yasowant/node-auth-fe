import { Navigate, Outlet, useLocation } from "react-router-dom";

import FullPageMessage from "./FullPageMessage";
import { useAuth } from "../hooks/useAuth";

/** Keeps signed-in users out of the login / register screens. */
const PublicOnlyRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageMessage>Loading...</FullPageMessage>;

  if (user) {
    return <Navigate to={location.state?.from || "/dashboard"} replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
