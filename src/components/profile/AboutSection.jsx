import Field from "./Field";
import SectionShell from "./SectionShell";
import TagInput from "./TagInput";

const AboutSection = ({ form }) => {
  const { draft, setField, reset } = form;

  return (
    <SectionShell
      title="About and skills"
      description="A short summary, and the skills you want to be found for."
      onReset={reset}
      onSave={form.save}
      saving={form.saving}
      error={form.error}
    >
      <Field
        label="About you"
        as="textarea"
        span={2}
        maxLength={1000}
        value={draft.bio}
        onChange={(e) => setField("bio", e.target.value)}
        placeholder="A few lines on what you build and what you are looking for."
        hint={`${draft.bio.length}/1000`}
      />

      <TagInput
        label="Skills"
        values={draft.skills}
        onChange={(value) => setField("skills", value)}
        placeholder="React, then Enter"
        hint="Enter or comma adds a skill. Backspace on an empty box removes the last one."
      />
    </SectionShell>
  );
};

export default AboutSection;
