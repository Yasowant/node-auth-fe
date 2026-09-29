import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import AccountMenu from "../components/AccountMenu";
import AppHeader from "../components/AppHeader";
import ApplyModal from "../components/ApplyModal";
import NotificationBell from "../components/NotificationBell";
import ThemeToggle from "../components/ThemeToggle";
import { SparkIcon } from "../components/icons";
import { useAgentChat } from "../hooks/useAgentChat";
import { useAuth } from "../hooks/useAuth";

const SUGGESTIONS = [
  "Find remote Angular jobs for 2 years of experience",
  "Show full-time Node.js roles in Bengaluru",
  "What's the status of my applications?",
  "Compare the top 3 frontend jobs for me",
];

/**
 * AI job assistant. The backend runs an agent loop (OpenAI tool calling) that
 * can search jobs, read job details and check the user's applications. It can
 * only *propose* applying; the user confirms through the normal ApplyModal,
 * which posts to the existing POST /applications endpoint.
 */
const Assistant = () => {
  const { user } = useAuth();
  const { messages, proposals, sending, error, send, retry, markApplied, reset } =
    useAgentChat();
  const [input, setInput] = useState("");
  const [applyingTo, setApplyingTo] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending, proposals]);

  // The assistant is candidate-only (the API returns 403 for other roles).
  if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
  if (user.role === "RECRUITER") return <Navigate to="/recruiter" replace />;

  const submit = (event) => {
    event.preventDefault();
    if (!input.trim() || sending) return;
    send(input);
    setInput("");
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) submit(event);
  };

  return (
    <>
      <AppHeader>
        <ThemeToggle />
        <NotificationBell />
        <AccountMenu />
      </AppHeader>

      <main className="page assistant-page">
        <div className="board-head">
          <div>
            <h1>AI job assistant</h1>
            <p className="field-hint">
              Ask in plain language. It searches live jobs on the board and
              checks your applications. It never applies without your
              confirmation.
            </p>
          </div>

          <div className="board-badges">
            {messages.length > 0 ? (
              <button type="button" className="btn btn-outline btn-sm" onClick={reset}>
                New chat
              </button>
            ) : null}
            <Link className="btn btn-outline btn-sm" to="/dashboard">
              Back to jobs
            </Link>
          </div>
        </div>

        <section className="assistant-panel" aria-label="Conversation">
          <div className="assistant-log" aria-live="polite">
            {messages.length === 0 ? (
              <div className="assistant-empty">
                <span className="assistant-empty-icon" aria-hidden="true">
                  <SparkIcon />
                </span>
                <h2>What are you looking for?</h2>
                <p>Try one of these:</p>
                <div className="assistant-suggestions">
                  {SUGGESTIONS.map((text) => (
                    <button
                      type="button"
                      key={text}
                      className="assistant-chip"
                      onClick={() => send(text)}
                      disabled={sending}
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`assistant-msg assistant-msg-${message.role}`}
                >
                  <span className="assistant-msg-who">
                    {message.role === "user" ? "You" : "Assistant"}
                  </span>
                  <div className="assistant-msg-body">{message.content}</div>
                </div>
              ))
            )}

            {sending ? (
              <div className="assistant-msg assistant-msg-assistant">
                <span className="assistant-msg-who">Assistant</span>
                <div className="assistant-msg-body assistant-typing">
                  Searching jobs<span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="alert alert-error assistant-error" role="alert">
                <span>{error}</span>
                <button type="button" className="btn btn-outline btn-sm" onClick={retry}>
                  Try again
                </button>
              </div>
            ) : null}

            {proposals.length > 0 ? (
              <div className="assistant-proposals">
                {proposals.map((proposal) => (
                  <article className="assistant-proposal" key={proposal.jobId}>
                    <div>
                      <h3>{proposal.title}</h3>
                      {proposal.company ? (
                        <p className="job-company">{proposal.company}</p>
                      ) : null}
                      {proposal.reason ? (
                        <p className="field-hint">{proposal.reason}</p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setApplyingTo(proposal)}
                    >
                      Apply
                    </button>
                  </article>
                ))}
              </div>
            ) : null}

            <div ref={endRef} />
          </div>

          <form className="assistant-composer" onSubmit={submit}>
            <textarea
              className="input"
              rows={2}
              maxLength={2000}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="e.g. Remote Angular jobs for 2 years of experience"
              aria-label="Message the assistant"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={sending || !input.trim()}
            >
              {sending ? "Thinking..." : "Send"}
            </button>
          </form>
        </section>
      </main>

      {applyingTo ? (
        <ApplyModal
          job={{
            id: applyingTo.jobId,
            title: applyingTo.title,
            company: applyingTo.company,
            screeningQuestions: applyingTo.screeningQuestions ?? [],
          }}
          onClose={() => setApplyingTo(null)}
          onSuccess={() => {
            markApplied(applyingTo);
            setApplyingTo(null);
          }}
        />
      ) : null}
    </>
  );
};

export default Assistant;
