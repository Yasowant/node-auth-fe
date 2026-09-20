import { CheckIcon } from "../icons";

/** Section list with per-section progress, so it is obvious what is left. */
const ProfileNav = ({ sections, active, onSelect, draft }) => (
  <nav className="pf-nav" aria-label="Profile sections">
    {sections.map((section) => {
      const done = section.done(draft);
      const complete = done >= section.total;

      return (
        <button
          type="button"
          key={section.id}
          className={`pf-nav-item${active === section.id ? " is-active" : ""}`}
          aria-current={active === section.id ? "true" : undefined}
          onClick={() => onSelect(section.id)}
        >
          <span className="pf-nav-icon" aria-hidden="true">
            {section.icon}
          </span>

          <span className="pf-nav-label">{section.label}</span>

          <span
            className={`pf-nav-state${complete ? " is-done" : ""}`}
            aria-label={
              complete ? "Complete" : `${done} of ${section.total} filled`
            }
          >
            {complete ? (
              <CheckIcon width="12" height="12" />
            ) : (
              `${done}/${section.total}`
            )}
          </span>
        </button>
      );
    })}
  </nav>
);

export default ProfileNav;
