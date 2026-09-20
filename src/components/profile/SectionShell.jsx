import { useState } from "react";

/** Panel chrome: heading, the fields, and the save row every section shares. */
const SectionShell = ({
  title,
  description,
  children,
  onSave,
  onReset,
  saving = false,
  error = "",
}) => {
  const [note, setNote] = useState("");

  const save = async () => {
    setNote("");

    try {
      await onSave?.();
      setNote("Saved.");
      window.setTimeout(() => setNote(""), 4000);
    } catch {
      // The message is surfaced through the `error` prop below.
    }
  };

  return (
    <section className="pf-panel">
      <header className="pf-panel-head">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </header>

      <div className="pf-grid">{children}</div>

      <footer className="pf-panel-foot">
        <button
          type="button"
          className="btn btn-primary"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>

        <button
          type="button"
          className="btn btn-ghost"
          onClick={onReset}
          disabled={saving}
        >
          Discard
        </button>

        {error ? (
          <span className="pf-note pf-note-error" role="alert">
            {error}
          </span>
        ) : note ? (
          <span className="pf-note">{note}</span>
        ) : null}
      </footer>
    </section>
  );
};

export default SectionShell;
