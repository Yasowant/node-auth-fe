import { BookmarkIcon } from "./icons";
import { experienceLabel } from "../data/jobs";

const initials = (company) =>
  company
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const JobCard = ({
  job,
  saved = false,
  onToggleSave,
  applied = false,
  onApply,
}) => (
  <article className="job-card">
    <div className="job-card-top">
      <span className="company-logo" aria-hidden="true">
        {initials(job.company)}
      </span>

      <div className="job-card-heading">
        <h3 className="job-title">{job.title}</h3>
        <p className="job-company">{job.company}</p>
      </div>

      <button
        type="button"
        className={`icon-button${saved ? " is-active" : ""}`}
        aria-pressed={saved}
        onClick={() => onToggleSave?.(job.id)}
      >
        <BookmarkIcon filled={saved} />
        <span className="visually-hidden">
          {saved ? `Remove ${job.title} from saved` : `Save ${job.title}`}
        </span>
      </button>
    </div>

    <div className="job-meta">
      <span>{job.location}</span>
      <span>{experienceLabel(job)}</span>
      <span>{job.salary}</span>
    </div>

    <div className="tag-row">
      <span className="tag tag-brand">{job.workMode}</span>
      <span className="tag">{job.type}</span>
      {job.skills.slice(0, 3).map((skill) => (
        <span className="tag" key={skill}>
          {skill}
        </span>
      ))}
    </div>

    <div className="job-card-foot">
      <span>
        {job.postedDaysAgo === 1
          ? "Posted yesterday"
          : `Posted ${job.postedDaysAgo} days ago`}
      </span>

      <span>{job.applicants} applicants</span>
    </div>
    <div className="job-card-actions">
      <button
        type="button"
        className={`btn btn-block${applied ? " btn-outline" : " btn-primary"}`}
        onClick={() => onApply?.(job)}
        disabled={applied}
      >
        {applied ? "Applied" : "Apply"}
      </button>
    </div>
  </article>
);

export default JobCard;
