import Logo from "./Logo";
import { CheckIcon } from "./icons";

const DEFAULT_POINTS = [
  "One profile, every application",
  "Roles from 2,800+ hiring companies",
  "Free for job seekers, always",
];

/**
 * Split screen used by every auth page: brand panel on the left (hidden on
 * small screens), form on the right.
 */
const AuthLayout = ({ heading, blurb, points = DEFAULT_POINTS, children }) => (
  <div className="auth-layout">
    <aside className="auth-aside">
      <Logo />

      <div className="auth-pitch">
        <h2>{heading}</h2>
        <p>{blurb}</p>

        <ul className="auth-points">
          {points.map((point) => (
            <li key={point}>
              <CheckIcon />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <p className="field-hint" style={{ color: "rgba(255,255,255,0.7)" }}>
        Sample data shown throughout this demo.
      </p>
    </aside>

    <main className="auth-main">{children}</main>
  </div>
);

export default AuthLayout;
