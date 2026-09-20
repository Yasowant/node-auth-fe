import Field from "./Field";
import SectionShell from "./SectionShell";
import { PlusIcon, TrashIcon } from "../icons";
import { blankExperience } from "../../hooks/useProfileDraft";

const ExperienceSection = ({ form }) => {
  const { draft, addRow, updateRow, removeRow, reset } = form;

  const set = (key) => (name) => (event) =>
    updateRow(
      "experience",
      key,
      name,
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value,
    );

  return (
    <SectionShell
      title="Experience"
      description="Most recent first. Leave the end date empty for your current role."
      onReset={reset}
      onSave={form.save}
      saving={form.saving}
      error={form.error}
    >
      <div className="pf-rows">
        {draft.experience.length === 0 ? (
          <p className="pf-empty">No roles added yet.</p>
        ) : (
          draft.experience.map((row, index) => {
            const field = set(row._key);

            return (
              <article className="pf-row" key={row._key}>
                <header className="pf-row-head">
                  <h3>Role {index + 1}</h3>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => removeRow("experience", row._key)}
                  >
                    <TrashIcon />
                    <span className="visually-hidden">
                      Remove role {index + 1}
                    </span>
                  </button>
                </header>

                <div className="pf-grid">
                  <Field
                    label="Designation"
                    value={row.designation}
                    onChange={field("designation")}
                    placeholder="Senior Frontend Engineer"
                  />
                  <Field
                    label="Company"
                    value={row.company}
                    onChange={field("company")}
                    placeholder="Company name"
                  />
                  <Field
                    label="Location"
                    value={row.location}
                    onChange={field("location")}
                    placeholder="City, or Remote"
                  />
                  <Field
                    label="Start date"
                    type="date"
                    value={row.startDate}
                    onChange={field("startDate")}
                  />
                  <Field
                    label="End date"
                    type="date"
                    value={row.endDate}
                    onChange={field("endDate")}
                    disabled={row.currentlyWorking}
                  />

                  <Field label="Currently working">
                    <label className="pf-check">
                      <input
                        type="checkbox"
                        checked={row.currentlyWorking}
                        onChange={field("currentlyWorking")}
                      />
                      <span>I still work here</span>
                    </label>
                  </Field>

                  <Field
                    label="What you did"
                    as="textarea"
                    span={2}
                    rows={4}
                    maxLength={1000}
                    value={row.description}
                    onChange={field("description")}
                    placeholder="Two or three lines on the work and its impact."
                  />
                </div>
              </article>
            );
          })
        )}

        <button
          type="button"
          className="pf-add"
          onClick={() => addRow("experience", blankExperience)}
        >
          <PlusIcon />
          Add a role
        </button>
      </div>
    </SectionShell>
  );
};

export default ExperienceSection;
