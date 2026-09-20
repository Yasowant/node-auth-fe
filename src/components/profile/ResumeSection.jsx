import { useRef, useState } from "react";

import SectionShell from "./SectionShell";
import api from "../../api/axios";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { FileIcon, TrashIcon } from "../icons";

// Mirrors the real limits enforced server-side by resumeUpload in
// uploadMiddleware.js -- keep these two in sync if that ever changes.
const MAX_MB = 10;
const ACCEPTED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

/** Uploads straight to POST /auth/profile/resume the moment a file is
 *  picked -- the resume is live on the profile immediately, it isn't
 *  staged behind this panel's "Save changes" button. */
const ResumeSection = ({ form }) => {
  const { draft, setGroupField, reset } = form;
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const pick = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("Resume must be a PDF or Word document.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      setError(
        `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_MB} MB.`,
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setError("");
    setUploading(true);

    const body = new FormData();
    body.append("resume", file);

    try {
      // No explicit Content-Type here -- the browser sets
      // multipart/form-data with the right boundary on its own; setting it
      // by hand strips that boundary and the upload fails.
      const { data } = await api.post("/auth/profile/resume", body);

      setGroupField("resume", "fileName", data?.resume?.fileName ?? file.name);
      setGroupField("resume", "url", data?.resume?.url ?? "");
    } catch (uploadError) {
      setError(
        getErrorMessage(
          uploadError,
          "Couldn't upload that resume. Please try again.",
        ),
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const clear = () => {
    setGroupField("resume", "fileName", "");
    setGroupField("resume", "url", "");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <SectionShell
      title="Resume"
      description="One file, attached to every application you send."
      onReset={reset}
      onSave={form.save}
      saving={form.saving}
      error={form.error}
    >
      <div className="pf-full">
        {draft.resume.fileName ? (
          <div className="resume-card">
            <span className="resume-icon" aria-hidden="true">
              <FileIcon width="18" height="18" />
            </span>

            <span className="resume-body">
              <strong>{draft.resume.fileName}</strong>
              <small>
                {uploading
                  ? "Uploading..."
                  : draft.resume.url
                    ? "On your profile"
                    : "Selected, not uploaded"}
              </small>
            </span>

            <button
              type="button"
              className="icon-button"
              onClick={clear}
              disabled={uploading}
            >
              <TrashIcon />
              <span className="visually-hidden">Remove resume</span>
            </button>
          </div>
        ) : (
          <label className={`resume-drop${uploading ? " is-disabled" : ""}`}>
            <FileIcon width="22" height="22" />
            <strong>{uploading ? "Uploading..." : "Choose a resume"}</strong>
            <span>PDF or DOC, up to {MAX_MB} MB</span>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={pick}
              disabled={uploading}
              className="visually-hidden"
            />
          </label>
        )}

        {error ? <p className="alert alert-error">{error}</p> : null}
      </div>
    </SectionShell>
  );
};

export default ResumeSection;
