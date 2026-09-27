import { Navigate } from "react-router-dom";

import AccountMenu from "../components/AccountMenu";
import AppHeader from "../components/AppHeader";
import JobBrowser from "../components/JobBrowser";
import { useAuth } from "../hooks/useAuth";
import NotificationBell from "../components/NotificationBell";

const WORK_STATUS_LABELS = {
  FRESHER: "Fresher",
  EXPERIENCED: "Experienced",
};

const Dashboard = () => {
  const { user } = useAuth();

  // Admins and recruiters have their own consoles; the candidate board has
  // nothing for them.
  if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
  if (user.role === "RECRUITER") return <Navigate to="/recruiter" replace />;

  return (
    <>
      <AppHeader>
        <NotificationBell />
        <AccountMenu />
      </AppHeader>

      <main className="page">
        <div className="board-head">
          <div>
            <h1>Welcome back, {user.name.trim().split(" ")[0]}</h1>

            <p className="field-hint">
              Your job board. Active roles from employers show up here as soon
              as they're posted.
            </p>
          </div>

          <div className="board-badges">
            {user.workStatus ? (
              <span className="tag tag-brand">
                {WORK_STATUS_LABELS[user.workStatus] ?? user.workStatus}
              </span>
            ) : null}

            <span className="tag">{user.role}</span>
          </div>
        </div>

        <JobBrowser />
      </main>
    </>
  );
};

export default Dashboard;
