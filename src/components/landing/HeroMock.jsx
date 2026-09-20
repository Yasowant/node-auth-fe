import { CheckIcon } from "../icons";

const ROWS = [
  { label: "Contact details", state: "Done", tone: "success" },
  { label: "Work status", state: "Fresher", tone: "brand" },
  { label: "Skills", state: "6 added", tone: "muted" },
];

/** Decorative profile mock shown beside the hero copy. */
const HeroMock = () => (
  <div className="hero-mock" aria-hidden="true">
    <div className="mock-window">
      <div className="mock-bar">
        <span />
        <span />
        <span />
        <p>Your profile</p>
      </div>

      <div className="mock-body">
        <div className="mock-profile">
          <span className="header-avatar">Y</span>
          <span className="mock-row-text">
            <strong>Your name</strong>
            <small>you@example.com</small>
          </span>
        </div>

        <div className="mock-meter">
          <div className="mock-meter-head">
            <span>Profile strength</span>
            <strong>80%</strong>
          </div>
          <div className="mock-meter-track">
            <div className="mock-meter-fill" />
          </div>
        </div>

        {ROWS.map((row) => (
          <div className="mock-row" key={row.label}>
            <span className="mock-row-text">
              <strong>{row.label}</strong>
            </span>
            <span className={`pill pill-${row.tone}`}>{row.state}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="mock-badge mock-badge-a">
      <CheckIcon />
      Free forever
    </div>

    <div className="mock-badge mock-badge-b">
      <CheckIcon />
      Set up in a minute
    </div>
  </div>
);

export default HeroMock;
