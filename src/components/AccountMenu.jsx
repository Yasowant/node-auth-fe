import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  BookmarkIcon,
  BriefcaseIcon,
  ChevronIcon,
  CloseIcon,
  LockIcon,
  LogOutIcon,
  SparkIcon,
  UserIcon,
} from "./icons";
import { useAuth } from "../hooks/useAuth";
import { ROLE_LABELS, initialsOf, profileScore } from "../utils/adminUsers";

/** Items without a page yet are shown but not linked -- a menu entry that
 *  goes nowhere is worse than one that says it is not ready. Recruiters get
 *  their console instead of the candidate-only links. */
const CANDIDATE_LINKS = [
  { to: "/profile", label: "View and update profile", icon: <UserIcon /> },
  { label: "Saved jobs", icon: <BookmarkIcon />, soon: true },
  { to: "/applications", label: "My applications", icon: <BriefcaseIcon /> },
  { to: "/assistant", label: "AI job assistant", icon: <SparkIcon /> },
  { label: "Change password", icon: <LockIcon />, soon: true },
];

const RECRUITER_LINKS = [
  { to: "/profile", label: "View and update profile", icon: <UserIcon /> },
  { to: "/recruiter", label: "Recruiter console", icon: <BriefcaseIcon /> },
  { label: "Change password", icon: <LockIcon />, soon: true },
];

/**
 * The header identity chip, plus the panel it opens. Drops into AppHeader in
 * place of the old static avatar and log-out button.
 */
const AccountMenu = () => {
  const { user, logout, becomeRecruiter } = useAuth();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [becomingRecruiter, setBecomingRecruiter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleLogout = async () => {
    setSigningOut(true);
    await logout();
    navigate("/login", { replace: true });
  };

  const handleBecomeRecruiter = async () => {
    setBecomingRecruiter(true);
    try {
      await becomeRecruiter();
      setOpen(false);
      navigate("/recruiter/company");
    } catch {
      setBecomingRecruiter(false);
    }
  };

  const score = profileScore(user);
  const links = user.role === "RECRUITER" ? RECRUITER_LINKS : CANDIDATE_LINKS;

  return (
    <>
      <button
        type="button"
        className={`account-chip${open ? " is-open" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="header-avatar" aria-hidden="true">
          {initialsOf(user.name)}
        </span>

        <span className="header-user-text">
          <strong>{user.name}</strong>
          <small>{user.email}</small>
        </span>

        <ChevronIcon className="account-chip-caret" />
        <span className="visually-hidden">Open account menu</span>
      </button>

      {open ? (
        <>
          <div
            className="drawer-backdrop"
            onClick={() => setOpen(false)}
            role="presentation"
          />

          <aside
            className="drawer account-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Account"
          >
            <header className="drawer-head">
              <span className="header-avatar drawer-avatar" aria-hidden="true">
                {initialsOf(user.name)}
              </span>

              <span className="drawer-head-text">
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <span className="tag-row">
                  <span className="tag tag-brand">
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                </span>
              </span>

              <button
                type="button"
                className="icon-button"
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
                <span className="visually-hidden">Close account menu</span>
              </button>
            </header>

            <div className="drawer-body">
              <div className="mock-meter account-meter">
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
                <p className="field-hint">
                  {score === 100
                    ? "Your profile is complete."
                    : "A fuller profile is what recruiters actually read."}
                </p>
              </div>

              {user.role === "USER" ? (
                <button
                  type="button"
                  className="account-link"
                  onClick={handleBecomeRecruiter}
                  disabled={becomingRecruiter}
                >
                  <BriefcaseIcon />
                  <span>
                    {becomingRecruiter
                      ? "Setting up..."
                      : "Become a recruiter"}
                  </span>
                </button>
              ) : null}

              <nav className="account-links" aria-label="Account">
                {links.map((item) =>
                  item.soon ? (
                    <span className="account-link is-soon" key={item.label}>
                      {item.icon}
                      <span>{item.label}</span>
                      <span className="pill pill-muted">Soon</span>
                    </span>
                  ) : (
                    <Link
                      className="account-link"
                      to={item.to}
                      key={item.label}
                      onClick={() => setOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      <ChevronIcon className="account-link-caret" />
                    </Link>
                  ),
                )}
              </nav>

              <button
                type="button"
                className="account-link is-danger"
                onClick={handleLogout}
                disabled={signingOut}
              >
                <LogOutIcon />
                <span>{signingOut ? "Logging out..." : "Log out"}</span>
              </button>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
};

export default AccountMenu;
