import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import AccountMenu from "../components/AccountMenu";
import AppHeader from "../components/AppHeader";
import ChoiceGroup from "../components/ChoiceGroup";
import Field from "../components/profile/Field";
import TagInput from "../components/profile/TagInput";
import { PlusIcon, TrashIcon } from "../components/icons";
import { createJob } from "../api/jobs";
import { useCompany } from "../hooks/useCompany";
import { useFormSubmit } from "../hooks/useFormSubmit";
import NotificationBell from "../components/NotificationBell";

// Mirrors the workMode/employmentType enums on the Job model.
const WORK_MODE_OPTIONS = [
  { value: "REMOTE", title: "Remote", note: "Work from anywhere" },
  { value: "HYBRID", title: "Hybrid", note: "Some days in the office" },
  { value: "ONSITE", title: "On-site", note: "In the office" },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "FULL_TIME", title: "Full-time", note: "" },
  { value: "PART_TIME", title: "Part-time", note: "" },
  { value: "CONTRACT", title: "Contract", note: "" },
  { value: "INTERNSHIP", title: "Internship", note: "" },
];

const STATUS_OPTIONS = [
  { value: "DRAFT", title: "Save as draft", note: "Only you can see it" },
  { value: "ACTIVE", title: "Publish now", note: "Goes live on the board" },
];

const CURRENCY_OPTIONS = [
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
];

const PERIOD_OPTIONS = [
  { value: "year", label: "per year" },
  { value: "month", label: "per month" },
];

let questionSeq = 0;
const blankQuestion = () => ({
  key: `q${++questionSeq}`,
  question: "",
  required: false,
});

// The Job model stores screeningQuestions with a `type` field, but nothing
// in this app reads it back to change how a question is rendered -- the
// apply flow always shows a free-text box (see ApplyModal.jsx). So the
// recruiter side doesn't ask for a type either; every question created here
// is just stamped "TEXT" to satisfy the schema's required field.
const QUESTION_TYPE = "TEXT";

const linesToList = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const BLANK = {
  title: "",
  description: "",
  category: "",
  skills: [],
  city: "",
  state: "",
  country: "",
  workMode: "",
  employmentType: "",
  minYears: "",
  maxYears: "",
  salaryMin: "",
  salaryMax: "",
  currency: "INR",
  period: "year",
  isDisclosed: false,
  openings: "1",
  responsibilities: "",
  requirements: "",
  status: "DRAFT",
};

const toNumberOrUndefined = (value) =>
  value === "" || value === null || value === undefined
    ? undefined
    : Number(value);

/** Posting form for a recruiter's own company -- POST /jobs. Recruiters
 *  without a company yet are sent to create one first. */
const JobForm = () => {
  const navigate = useNavigate();
  const { company, notFound, loading: companyLoading } = useCompany();
  const [values, setValues] = useState(BLANK);
  const [questions, setQuestions] = useState([]);

  const setField = (name) => (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const addQuestion = () =>
    setQuestions((current) => [...current, blankQuestion()]);

  const updateQuestion = (key, field, value) =>
    setQuestions((current) =>
      current.map((item) =>
        item.key === key ? { ...item, [field]: value } : item,
      ),
    );

  const removeQuestion = (key) =>
    setQuestions((current) => current.filter((item) => item.key !== key));

  const { submitting, error, onSubmit } = useFormSubmit(
    async () => {
      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category.trim() || undefined,
        skills: values.skills,
        location: {
          city: values.city.trim() || undefined,
          state: values.state.trim() || undefined,
          country: values.country.trim() || undefined,
        },
        workMode: values.workMode || undefined,
        employmentType: values.employmentType || undefined,
        experience: {
          min: toNumberOrUndefined(values.minYears),
          max: toNumberOrUndefined(values.maxYears),
        },
        salary: {
          min: toNumberOrUndefined(values.salaryMin),
          max: toNumberOrUndefined(values.salaryMax),
          currency: values.currency,
          period: values.period,
          isDisclosed: values.isDisclosed,
        },
        openings: values.openings === "" ? 1 : Number(values.openings),
        responsibilities: linesToList(values.responsibilities),
        requirements: linesToList(values.requirements),
        screeningQuestions: questions
          .filter((item) => item.question.trim())
          .map((item) => ({
            question: item.question.trim(),
            type: QUESTION_TYPE,
            required: item.required,
          })),
        status: values.status,
      };

      await createJob(payload);
      navigate("/recruiter", { replace: true });
    },
    { fallbackMessage: "Couldn't post that job. Please try again." },
  );

  if (companyLoading) {
    return (
      <>
        <AppHeader>
          <NotificationBell/>
          <AccountMenu />
        </AppHeader>
        <main className="page">
          <div className="empty-state">
            <h2>Loading…</h2>
          </div>
        </main>
      </>
    );
  }

  // Nothing owns creating a job without a company to attach it to.
  if (notFound || !company) {
    return <Navigate to="/recruiter/company" replace />;
  }

  return (
    <>
      <AppHeader>
        <AccountMenu />
      </AppHeader>

      <main className="page">
        <div className="board-head">
          <div>
            <h1>Post a job</h1>
            <p className="field-hint">Posting as {company.name}.</p>
          </div>
        </div>

        <form className="pf-panel" onSubmit={onSubmit}>
          <div className="pf-panel-head">
            <h2>Role details</h2>
            <p>
              Title and description are required; the rest sharpens who
              applies.
            </p>
          </div>

          <div className="pf-grid">
            <Field
              label="Job title"
              span={2}
              value={values.title}
              onChange={setField("title")}
              placeholder="Senior Frontend Engineer"
              required
            />

            <Field
              label="Description"
              as="textarea"
              span={2}
              rows={6}
              value={values.description}
              onChange={setField("description")}
              placeholder="What the role is and what a day looks like."
              required
            />

            <Field
              label="Category"
              value={values.category}
              onChange={setField("category")}
              placeholder="Engineering"
            />

            <TagInput
              label="Skills"
              values={values.skills}
              onChange={(skills) =>
                setValues((previous) => ({ ...previous, skills }))
              }
              placeholder="React, then Enter"
              hint="Enter or comma adds a skill."
            />

            <Field
              label="City"
              value={values.city}
              onChange={setField("city")}
              placeholder="Bengaluru"
            />

            <Field
              label="State"
              value={values.state}
              onChange={setField("state")}
              placeholder="Karnataka"
            />

            <Field
              label="Country"
              value={values.country}
              onChange={setField("country")}
              placeholder="India"
            />

            <Field
              label="Openings"
              type="number"
              min="1"
              value={values.openings}
              onChange={setField("openings")}
            />

            <ChoiceGroup
              legend="Work mode"
              name="workMode"
              value={values.workMode}
              onChange={setField("workMode")}
              options={WORK_MODE_OPTIONS}
            />

            <ChoiceGroup
              legend="Employment type"
              name="employmentType"
              value={values.employmentType}
              onChange={setField("employmentType")}
              options={EMPLOYMENT_TYPE_OPTIONS}
            />

            <Field
              label="Min. years experience"
              type="number"
              min="0"
              value={values.minYears}
              onChange={setField("minYears")}
            />

            <Field
              label="Max. years experience"
              type="number"
              min="0"
              value={values.maxYears}
              onChange={setField("maxYears")}
            />

            <Field
              label="Salary min"
              type="number"
              min="0"
              value={values.salaryMin}
              onChange={setField("salaryMin")}
            />

            <Field
              label="Salary max"
              type="number"
              min="0"
              value={values.salaryMax}
              onChange={setField("salaryMax")}
            />

            <Field
              label="Currency"
              as="select"
              options={CURRENCY_OPTIONS}
              value={values.currency}
              onChange={setField("currency")}
            />

            <Field
              label="Salary period"
              as="select"
              options={PERIOD_OPTIONS}
              value={values.period}
              onChange={setField("period")}
            />

            <Field label="Salary visibility">
              <label className="pf-check">
                <input
                  type="checkbox"
                  checked={values.isDisclosed}
                  onChange={setField("isDisclosed")}
                />
                <span>Show salary on the listing</span>
              </label>
            </Field>

            <Field
              label="Responsibilities"
              as="textarea"
              span={2}
              rows={4}
              value={values.responsibilities}
              onChange={setField("responsibilities")}
              hint="One responsibility per line."
            />

            <Field
              label="Requirements"
              as="textarea"
              span={2}
              rows={4}
              value={values.requirements}
              onChange={setField("requirements")}
              hint="One requirement per line."
            />
          </div>

          <div className="pf-rows">
            <header className="pf-panel-head">
              <h2>Screening questions</h2>
              <p>Optional. Candidates answer these when they apply.</p>
            </header>

            {questions.length === 0 ? (
              <p className="pf-empty">No screening questions added.</p>
            ) : (
              questions.map((item, index) => (
                <article className="pf-row" key={item.key}>
                  <header className="pf-row-head">
                    <h3>Question {index + 1}</h3>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => removeQuestion(item.key)}
                    >
                      <TrashIcon />
                      <span className="visually-hidden">
                        Remove question {index + 1}
                      </span>
                    </button>
                  </header>

                  <div className="pf-grid">
                    <Field
                      label="Question"
                      span={2}
                      value={item.question}
                      onChange={(event) =>
                        updateQuestion(item.key, "question", event.target.value)
                      }
                      placeholder="Why do you want to work here?"
                    />

                    <Field label="Required">
                      <label className="pf-check">
                        <input
                          type="checkbox"
                          checked={item.required}
                          onChange={(event) =>
                            updateQuestion(
                              item.key,
                              "required",
                              event.target.checked,
                            )
                          }
                        />
                        <span>Candidate must answer</span>
                      </label>
                    </Field>
                  </div>
                </article>
              ))
            )}

            <button type="button" className="pf-add" onClick={addQuestion}>
              <PlusIcon />
              Add a question
            </button>
          </div>

          <div className="pf-grid">
            <ChoiceGroup
              legend="Visibility"
              name="status"
              value={values.status}
              onChange={setField("status")}
              options={STATUS_OPTIONS}
            />
          </div>

          <footer className="pf-panel-foot">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? "Posting…"
                : values.status === "ACTIVE"
                  ? "Publish job"
                  : "Save draft"}
            </button>

            {error ? (
              <span className="pf-note pf-note-error" role="alert">
                {error}
              </span>
            ) : null}
          </footer>
        </form>
      </main>
    </>
  );
};

export default JobForm;
