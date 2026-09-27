import AccountMenu from "../components/AccountMenu";
import AppHeader from "../components/AppHeader";
import NotificationBell from "../components/NotificationBell";
import { useApplications } from "../hooks/useApplications";

const STATUS_LABELS = {
  APPLIED: "Applied",
  UNDER_REVIEW: "Under review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  OFFERED: "Offered",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const STATUS_PILL_CLASS = {
  APPLIED: "pill-brand",
  UNDER_REVIEW: "pill-brand",
  SHORTLISTED: "pill-success",
  INTERVIEW: "pill-success",
  OFFERED: "pill-success",
  REJECTED: "pill-danger",
  WITHDRAWN: "pill-muted",
};

const CLOSED_STATUSES = new Set(["WITHDRAWN", "REJECTED", "OFFERED"]);

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const Applications = () => {
  const {
    applications,
    loading,
    error,
    refetch,
    withdraw,
    withdrawingId,
    actionError,
  } = useApplications();

  return (
    <>
      <AppHeader>
        <NotificationBell/>
        <AccountMenu />
      </AppHeader>

      <main className="page">
        <div className="board-head">
          <div>
            <h1>My applications</h1>
            <p className="field-hint">
              Every role you've applied to, and where it stands.
            </p>
          </div>
        </div>

        {actionError ? (
          <p className="alert alert-error" role="alert">
            {actionError}
          </p>
        ) : null}

        {loading ? (
          <div className="empty-state">
            <h2>Loading your applications…</h2>
          </div>
        ) : error ? (
          <div className="empty-state">
            <h2>Couldn't load your applications</h2>
            <p>{error}</p>
            <button type="button" className="btn btn-outline" onClick={refetch}>
              Try again
            </button>
          </div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <h2>No applications yet</h2>
            <p>Roles you apply to from the board will show up here.</p>
          </div>
        ) : (
          <div className="card-grid">
            {applications.map((application) => (
              <article className="job-card" key={application._id}>
                <div className="job-card-top">
                  <div className="job-card-heading">
                    <h3 className="job-title">
                      {application.job?.title ?? "Job removed"}
                    </h3>
                    <p className="job-company">
                      {application.company?.name ?? ""}
                    </p>
                  </div>

                  <span
                    className={`pill ${
                      STATUS_PILL_CLASS[application.status] ?? "pill-muted"
                    }`}
                  >
                    {STATUS_LABELS[application.status] ?? application.status}
                  </span>
                </div>

                <div className="job-card-foot">
                  <span>Applied {formatDate(application.createdAt)}</span>
                </div>

                {!CLOSED_STATUSES.has(application.status) ? (
                  <div className="job-card-actions">
                    <button
                      type="button"
                      className="btn btn-outline btn-block"
                      onClick={() => withdraw(application._id)}
                      disabled={withdrawingId === application._id}
                    >
                      {withdrawingId === application._id
                        ? "Withdrawing..."
                        : "Withdraw"}
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Applications;
