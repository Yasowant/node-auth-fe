import { useState } from "react";
import { Link } from "react-router-dom";

import Logo from "./Logo";
import { CloseIcon, MenuIcon } from "./icons";
import { useAuth } from "../hooks/useAuth";

const LINKS = [
  { href: "#features", label: "Why WorkWise" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

const SiteNav = () => {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const actions = loading ? null : user ? (
    <Link className="btn btn-primary" to="/dashboard" onClick={close}>
      Go to dashboard
    </Link>
  ) : (
    <>
      <Link className="btn btn-ghost" to="/login" onClick={close}>
        Log in
      </Link>
      <Link className="btn btn-primary" to="/register" onClick={close}>
        Create account
      </Link>
    </>
  );

  return (
    <header className={`site-nav${open ? " is-open" : ""}`}>
      <div className="container">
        <Logo />

        <nav className="nav-links" aria-label="Main">
          {LINKS.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">{actions}</div>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
          <span className="visually-hidden">
            {open ? "Close menu" : "Open menu"}
          </span>
        </button>
      </div>

      {open ? (
        <div className="mobile-menu" id="mobile-menu">
          <nav aria-label="Mobile">
            {LINKS.map((link) => (
              <a href={link.href} key={link.href} onClick={close}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mobile-actions">{actions}</div>
        </div>
      ) : null}
    </header>
  );
};

export default SiteNav;
