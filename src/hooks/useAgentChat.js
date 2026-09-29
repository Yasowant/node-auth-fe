import { useCallback, useEffect, useRef, useState } from "react";

import { sendAgentMessage } from "../api/agent";

/**
 * Conversation state for the AI job assistant.
 *
 * - `messages` is exactly what the API expects: { role, content } pairs.
 * - `proposals` are jobs the agent suggested applying to. The agent never
 *   applies itself; the UI turns each one into an Apply button.
 */
export function useAgentChat() {
  const [messages, setMessages] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const controllerRef = useRef(null);

  // Cancel an in-flight request if the user leaves the page.
  useEffect(() => () => controllerRef.current?.abort(), []);

  /** Posts a conversation that already ends with a user message. */
  const request = useCallback(async (conversation) => {
    setMessages(conversation);
    setError("");
    setSending(true);

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      const data = await sendAgentMessage(conversation, {
        signal: controllerRef.current.signal,
      });
      setMessages([
        ...conversation,
        { role: "assistant", content: data.reply || "(no reply)" },
      ]);
      setProposals(Array.isArray(data.proposals) ? data.proposals : []);
    } catch (requestError) {
      if (requestError.name === "CanceledError") return;
      setError(
        requestError.friendlyMessage ||
          "The assistant couldn't answer right now. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }, []);

  const send = useCallback(
    (text) => {
      const content = text.trim();
      if (!content || sending) return;
      request([...messages, { role: "user", content }]);
    },
    [messages, sending, request],
  );

  /** Re-sends the same conversation after an error (it still ends with the
   *  user's unanswered message). */
  const retry = useCallback(() => {
    if (sending || messages.at(-1)?.role !== "user") return;
    request(messages);
  }, [messages, sending, request]);

  /** Called after the user actually applies to a proposed job. */
  const markApplied = useCallback((proposal) => {
    setProposals((current) =>
      current.filter((item) => item.jobId !== proposal.jobId),
    );
    setMessages((current) => [
      ...current,
      { role: "assistant", content: `Done: you applied to ${proposal.title}.` },
    ]);
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setMessages([]);
    setProposals([]);
    setError("");
    setSending(false);
  }, []);

  return { messages, proposals, sending, error, send, retry, markApplied, reset };
}

export default useAgentChat;
