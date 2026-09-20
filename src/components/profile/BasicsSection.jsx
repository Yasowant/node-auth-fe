import Field from "./Field";
import SectionShell from "./SectionShell";

const WORK_STATUS = [
  { value: "", label: "Not set" },
  { value: "FRESHER", label: "Fresher" },
  { value: "EXPERIENCED", label: "Experienced" },
];

const BasicsSection = ({ email, form }) => {
  const { draft, setField, setGroupField, reset } = form;

  return (
    <SectionShell
      title="Basics"
      description="How you appear at the top of an application."
      onReset={reset}
      onSave={form.save}
      saving={form.saving}
      error={form.error}
    >
      <Field
        label="Full name"
        value={draft.name}
        onChange={(e) => setField("name", e.target.value)}
        placeholder="Your name"
      />

      <Field label="Email" hint="Change this from account settings.">
        <input className="input" value={email} readOnly disabled />
      </Field>

      <Field
        label="Phone"
        type="tel"
        value={draft.phone}
        onChange={(e) => setField("phone", e.target.value)}
        placeholder="+91 98765 43210"
      />

      <Field
        label="Location"
        value={draft.location}
        onChange={(e) => setField("location", e.target.value)}
        placeholder="City you work from"
      />

      <Field
        label="Headline"
        span={2}
        maxLength={200}
        value={draft.headline}
        onChange={(e) => setField("headline", e.target.value)}
        placeholder="Frontend engineer building design systems"
        hint={`${draft.headline.length}/200 — one line recruiters see first.`}
      />

      <Field
        label="Work status"
        as="select"
        options={WORK_STATUS}
        value={draft.workStatus}
        onChange={(e) => setField("workStatus", e.target.value)}
      />

      <Field label="Total experience">
        <div className="pf-split">
          <input
            className="input"
            type="number"
            min="0"
            value={draft.totalExperience.years}
            onChange={(e) =>
              setGroupField("totalExperience", "years", e.target.value)
            }
            aria-label="Years"
          />
          <span>yr</span>

          <input
            className="input"
            type="number"
            min="0"
            max="11"
            value={draft.totalExperience.months}
            onChange={(e) =>
              setGroupField("totalExperience", "months", e.target.value)
            }
            aria-label="Months"
          />
          <span>mo</span>
        </div>
      </Field>
    </SectionShell>
  );
};

export default BasicsSection;
