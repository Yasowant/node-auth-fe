import { useEffect } from "react";

import RoleTag from "./RoleTag";
import { CloseIcon } from "../icons";
import {
  WORK_STATUS_LABELS,
  experienceOf,
  formatDate,
  initialsOf,
  profileScore,
} from "../../utils/adminUsers";

const Field = ({ label, children }) => (
  <div>
    <dt>{label}</dt>
    <dd>{children ?? <span className="cell-empty">Not provided</span>}</dd>
  </div>
);

const dateRange = (start, end, current) => {
  const from = start ? formatDate(start) : "--";
  const to = current ? "Present" : end ? formatDate(end) : "--";

  return `${from} - ${to}`;
};

const salaryOf = (user) => {
  const { min, max } = user.expectedSalary ?? {};

  if (min == null && max == null) return null;
  if (min != null && max != null) {
    return `${min.toLocaleString()} - ${max.toLocaleString()}`;
  }

  return (min ?? max).toLocaleString();
};

/** Read-only profile panel for one user. The API exposes no write routes,
 *  so this shows everything and changes nothing. */
const UserDetail = ({ user, onClose }) => {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!user) return null;

  const score = profileScore(user);
  const skills = user.skills ?? [];
  const experience = user.experience ?? [];
  const education = user.education ?? [];
  const preferred = user.preferredLocation ?? [];
  const salary = salaryOf(user);

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} role="presentation" />

      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Profile for ${user.name}`}
      >
        <header className="drawer-head">
          <span className="header-avatar drawer-avatar" aria-hidden="true">
            {initialsOf(user.name)}
          </span>

          <span className="drawer-head-text">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span className="tag-row">
              <RoleTag role={user.role} />
              {user.workStatus ? (
                <span className="tag">
                  {WORK_STATUS_LABELS[user.workStatus] ?? user.workStatus}
                </span>
              ) : null}
              <span
                className={`dot-flag${user.isActive === false ? " is-off" : ""}`}
              >
                {user.isActive === false ? "Deactivated" : "Active"}
              </span>
            </span>
          </span>

          <button type="button" className="icon-button" onClick={onClose}>
            <CloseIcon />
            <span className="visually-hidden">Close profile</span>
          </button>
        </header>

        <div className="drawer-body">
          <section className="drawer-section">
            <div className="mock-meter">
              <div className="mock-meter-head">
                <span>Profile completeness</span>
                <strong>{score}%</strong>
              </div>
              <div className="mock-meter-track">
                <div
                  className="mock-meter-fill"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </section>

          <section className="drawer-section">
            <h3>Account</h3>
            <dl className="detail-list">
              <Field label="User ID">
                <code className="mono">{user._id}</code>
              </Field>
              <Field label="Joined">{formatDate(user.createdAt)}</Field>
              <Field label="Last updated">{formatDate(user.updatedAt)}</Field>
              <Field label="Email verified">
                {user.isEmailVerified ? "Yes" : "No"}
              </Field>
            </dl>
          </section>

          <section className="drawer-section">
            <h3>Profile</h3>
            <dl className="detail-list">
              <Field label="Headline">{user.headline}</Field>
              <Field label="Phone">{user.phone}</Field>
              <Field label="Location">{user.location}</Field>
              <Field label="Total experience">
                {experienceOf(user) === "--" ? null : experienceOf(user)}
              </Field>
              <Field label="Bio">{user.bio}</Field>
              <Field label="Skills">
                {skills.length ? (
                  <span className="tag-row">
                    {skills.map((skill) => (
                      <span className="tag" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </span>
                ) : null}
              </Field>
            </dl>
          </section>

          <section className="drawer-section">
            <h3>Job preferences</h3>
            <dl className="detail-list">
              <Field label="Preferred title">{user.preferredJobTitle}</Field>
              <Field label="Preferred locations">
                {preferred.length ? preferred.join(", ") : null}
              </Field>
              <Field label="Expected salary">{salary}</Field>
              <Field label="Notice period">{user.noticePeriod}</Field>
              <Field label="Resume">
                {user.resume?.url ? (
                  <a href={user.resume.url} target="_blank" rel="noreferrer">
                    {user.resume.fileName ?? "View resume"}
                  </a>
                ) : null}
              </Field>
            </dl>
          </section>

          <section className="drawer-section">
            <h3>Experience</h3>

            {experience.length ? (
              <ul className="timeline">
                {experience.map((item, index) => (
                  <li key={`${item.company}-${index}`}>
                    <strong>{item.designation ?? "Role"}</strong>
                    <span>
                      {[item.company, item.location]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                    <small>
                      {dateRange(
                        item.startDate,
                        item.endDate,
                        item.currentlyWorking,
                      )}
                    </small>
                    {item.description ? <p>{item.description}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="cell-empty">No experience added.</p>
            )}
          </section>

          <section className="drawer-section">
            <h3>Education</h3>

            {education.length ? (
              <ul className="timeline">
                {education.map((item, index) => (
                  <li key={`${item.institution}-${index}`}>
                    <strong>
                      {[item.degree, item.fieldOfStudy]
                        .filter(Boolean)
                        .join(", ") || "Qualification"}
                    </strong>
                    <span>{item.institution}</span>
                    <small>
                      {[item.startYear, item.endYear]
                        .filter(Boolean)
                        .join(" - ") || "--"}
                      {item.grade ? ` · ${item.grade}` : ""}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="cell-empty">No education added.</p>
            )}
          </section>
        </div>
      </aside>
    </>
  );
};

export default UserDetail;
