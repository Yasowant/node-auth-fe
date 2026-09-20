import Field from "./Field";
import SectionShell from "./SectionShell";
import TagInput from "./TagInput";

const NOTICE = [
  { value: "", label: "Not set" },
  { value: "Immediate", label: "Immediately available" },
  { value: "15 days", label: "15 days" },
  { value: "30 days", label: "30 days" },
  { value: "60 days", label: "60 days" },
  { value: "90 days", label: "90 days" },
];

const PreferencesSection = ({ form }) => {
  const { draft, setField, setGroupField, reset } = form;

  return (
    <SectionShell
      title="Job preferences"
      description="What you are looking for. Only recruiters you apply to can see this."
      onReset={reset}
      onSave={form.save}
      saving={form.saving}
      error={form.error}
    >
      <Field
        label="Preferred job title"
        value={draft.preferredJobTitle}
        onChange={(e) => setField("preferredJobTitle", e.target.value)}
        placeholder="Frontend Engineer"
      />

      <Field
        label="Notice period"
        as="select"
        options={NOTICE}
        value={draft.noticePeriod}
        onChange={(e) => setField("noticePeriod", e.target.value)}
      />

      <TagInput
        label="Preferred locations"
        values={draft.preferredLocation}
        onChange={(value) => setField("preferredLocation", value)}
        placeholder="Bengaluru, then Enter"
      />

      <Field label="Expected salary" span={2} hint="Annual, in rupees.">
        <div className="pf-split">
          <input
            className="input"
            type="number"
            min="0"
            step="50000"
            value={draft.expectedSalary.min}
            onChange={(e) =>
              setGroupField("expectedSalary", "min", e.target.value)
            }
            placeholder="Minimum"
            aria-label="Minimum expected salary"
          />
          <span>to</span>
          <input
            className="input"
            type="number"
            min="0"
            step="50000"
            value={draft.expectedSalary.max}
            onChange={(e) =>
              setGroupField("expectedSalary", "max", e.target.value)
            }
            placeholder="Maximum"
            aria-label="Maximum expected salary"
          />
        </div>
      </Field>
    </SectionShell>
  );
};

export default PreferencesSection;
