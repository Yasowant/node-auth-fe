import { useState } from "react";

import { CloseIcon } from "./icons";
import { applyToJob } from "../api/applications";
import { useFormSubmit } from "../hooks/useFormSubmit";

/** Drawer for applying to one job: an optional cover note plus the job's
 *  screening questions, if it has any. Posts to POST /applications. */
const ApplyModal = ({ job, onClose, onSuccess }) => {
  const [coverNote, setCoverNote] = useState("");
  const [answers, setAnswers] = useState(() =>
    (job.screeningQuestions ?? []).map((item) => ({
      question: item.question,
      required: item.required,
      answer: "",
    })),
  );

  const setAnswer = (index, value) =>
    setAnswers((current) =>
      current.map((item, i) =>
        i === index ? { ...item, answer: value } : item,
      ),
    );

  const { submitting, error, onSubmit } = useFormSubmit(
    async () => {
      const { application } = await applyToJob(job.id, {
        coverNote: coverNote.trim() || undefined,
        answers: answers
          .filter((item) => item.answer.trim() !== "")
          .map(({ question, answer }) => ({ question, answer })),
      });
      onSuccess?.(application);
    },
    { fallbackMessage: "Couldn't submit your application. Please try again." },
  );

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} role="presentation" />

      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Apply to ${job.title}`}
      >
        <header className="drawer-head">
          <span className="drawer-head-text">
            <h2>Apply to {job.title}</h2>
            <p>{job.company}</p>
          </span>

          <button type="button" className="icon-button" onClick={onClose}>
            <CloseIcon />
            <span className="visually-hidden">Close</span>
          </button>
        </header>

        <form className="drawer-body" onSubmit={onSubmit}>
          {error ? (
            <p className="alert alert-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="form-field">
            <label htmlFor="apply-cover-note">Cover note (optional)</label>
            <textarea
              id="apply-cover-note"
              className="input"
              rows={5}
              maxLength={2000}
              value={coverNote}
              onChange={(event) => setCoverNote(event.target.value)}
              placeholder="A couple of lines on why you're a fit..."
            />
          </div>

          {answers.map((item, index) => (
            <div className="form-field" key={item.question}>
              <label htmlFor={`apply-answer-${index}`}>
                {item.question}
                {item.required ? " *" : ""}
              </label>
              <textarea
                id={`apply-answer-${index}`}
                className="input"
                rows={2}
                required={item.required}
                value={item.answer}
                onChange={(event) => setAnswer(index, event.target.value)}
              />
            </div>
          ))}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </aside>
    </>
  );
};

export default ApplyModal;
