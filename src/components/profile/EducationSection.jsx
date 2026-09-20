import Field from "./Field";
import SectionShell from "./SectionShell";
import { PlusIcon, TrashIcon } from "../icons";
import { blankEducation } from "../../hooks/useProfileDraft";

const EducationSection = ({ form }) => {
  const { draft, addRow, updateRow, removeRow, reset } = form;

  const set = (key) => (name) => (event) =>
    updateRow("education", key, name, event.target.value);

  return (
    <SectionShell
      title="Education"
      description="Degrees, diplomas and certifications worth listing."
      onReset={reset}
      onSave={form.save}
      saving={form.saving}
      error={form.error}
    >
      <div className="pf-rows">
        {draft.education.length === 0 ? (
          <p className="pf-empty">No education added yet.</p>
        ) : (
          draft.education.map((row, index) => {
            const field = set(row._key);

            return (
              <article className="pf-row" key={row._key}>
                <header className="pf-row-head">
                  <h3>Entry {index + 1}</h3>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => removeRow("education", row._key)}
                  >
                    <TrashIcon />
                    <span className="visually-hidden">
                      Remove entry {index + 1}
                    </span>
                  </button>
                </header>

                <div className="pf-grid">
                  <Field
                    label="Degree"
                    value={row.degree}
                    onChange={field("degree")}
                    placeholder="B.Tech"
                  />
                  <Field
                    label="Field of study"
                    value={row.fieldOfStudy}
                    onChange={field("fieldOfStudy")}
                    placeholder="Computer Science"
                  />
                  <Field
                    label="Institution"
                    span={2}
                    value={row.institution}
                    onChange={field("institution")}
                    placeholder="University or college"
                  />
                  <Field
                    label="Start year"
                    type="number"
                    min="1950"
                    max="2100"
                    value={row.startYear}
                    onChange={field("startYear")}
                    placeholder="2020"
                  />
                  <Field
                    label="End year"
                    type="number"
                    min="1950"
                    max="2100"
                    value={row.endYear}
                    onChange={field("endYear")}
                    placeholder="2024"
                  />
                  <Field
                    label="Grade"
                    value={row.grade}
                    onChange={field("grade")}
                    placeholder="8.6 CGPA"
                  />
                </div>
              </article>
            );
          })
        )}

        <button
          type="button"
          className="pf-add"
          onClick={() => addRow("education", blankEducation)}
        >
          <PlusIcon />
          Add education
        </button>
      </div>
    </SectionShell>
  );
};

export default EducationSection;
