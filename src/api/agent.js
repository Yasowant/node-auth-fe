import api from "./axios";

/**
 * Sends the whole conversation to the AI job assistant (the API is stateless).
 * The agent may call several tools before replying, so this gets a longer
 * timeout than the app-wide 15s default.
 *
 * @param {{ role: "user" | "assistant", content: string }[]} messages
 * @returns {Promise<{ reply: string, proposals: Array }>}
 */
export const sendAgentMessage = (messages, { signal } = {}) =>
  api
    .post("/agent/chat", { messages }, { signal, timeout: 60000 })
    .then((res) => res.data);
