import { Link } from "react-router-dom";

import AccountMenu from "../components/AccountMenu";
import AppHeader from "../components/AppHeader";
import { useCompany } from "../hooks/useCompany";
import { useMyJobs } from "../hooks/useMyJobs";
import NotificationBell from "../components/NotificationBell";
import ThemeToggle from "../components/ThemeToggle";

const STATUS_LABELS = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending review",
  ACTIVE: "Active",
  PAUSED: "Paused",
  CLOSED: "Closed",
  EXPIRED: "Expired",
};

const STATUS_PILL_CLASS = {
  DRAFT: "pill-muted",
  PENDING_REVIEW: "pill-brand",
  ACTIVE: "pill-success",
  PAUSED: "pill-brand",
  CLOSED: "pill-muted",
  EXPIRED: "pill-muted",
};

/** Recruiter landing page: create a company first, then post and track
 *  jobs against it. */
const RecruiterDashboard = () => {
  const { company, notFound, loading: companyLoading } = useCompany();
  const { jobs, loading: jobsLoading, error: jobsError } = useMyJobs();

  if (companyLoading) {
    return (
      <>
        <AppHeader>
          <ThemeToggle />
          <NotificationBell />
          <AccountMenu />
        </AppHeader>
        <main className="page">
          <div className="empty-state">
            <h2>Loading…</h2>
          </div>
        </main>
      </>
    );
  }

  const hasCompany = Boolean(company) && !notFound;

  return (
    <>
      <AppHeader>
        <AccountMenu />
      </AppHeader>

      <main className="page">
        <div className="board-head">
          <div>
            <h1>Recruiter console</h1>
            <p className="field-hint">
              {hasCompany
                ? `Posting as ${company.name}.`
                : "Create a company to start posting roles."}
            </p>
          </div>

          {hasCompany ? (
            <div className="board-badges">
              <Link className="btn btn-outline" to="/recruiter/company">
                Edit company
              </Link>
              <Link className="btn btn-primary" to="/recruiter/jobs/new">
                Post a job
              </Link>
            </div>
          ) : null}
        </div>

        {!hasCompany ? (
          <div className="empty-state">
            <h2>No company yet</h2>
            <p>You need a company before you can post a job.</p>
            <Link className="btn btn-primary" to="/recruiter/company">
              Create your company
            </Link>
          </div>
        ) : jobsLoading ? (
          <div className="empty-state">
            <h2>Loading your jobs…</h2>
          </div>
        ) : jobsError ? (
          <div className="empty-state">
            <h2>Couldn't load your jobs</h2>
            <p>{jobsError}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <h2>No jobs posted yet</h2>
            <p>Roles you post will show up here.</p>
            <Link className="btn btn-primary" to="/recruiter/jobs/new">
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="card-grid">
            {jobs.map((job) => (
              <article className="job-card" key={job._id}>
                <div className="job-card-top">
                  <div className="job-card-heading">
                    <h3 className="job-title">{job.title}</h3>
                    <p className="job-company">{job.category || " "}</p>
                  </div>

                  <span
                    className={`pill ${
                      STATUS_PILL_CLASS[job.status] ?? "pill-muted"
                    }`}
                  >
                    {STATUS_LABELS[job.status] ?? job.status}
                  </span>
                </div>

                <div className="job-card-foot">
                  <span>
                    {job.applicantCount ?? 0} applicant
                    {job.applicantCount === 1 ? "" : "s"}
                  </span>
                  <span>{job.viewCount ?? 0} views</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default RecruiterDashboard;
