const DEFAULT_FALLBACK = "Something went wrong. Please try again.";

const firstString = (...candidates) =>
  candidates.find((value) => typeof value === "string" && value.trim() !== "");

/**
 * Turns any thrown value (axios error, network failure, plain Error) into a
 * message that is safe to render. Never throws, always returns a string.
 */
export function getErrorMessage(error, fallback = DEFAULT_FALLBACK) {
  if (!error) return fallback;

  const data = error.response?.data;

  // API responded with a body: prefer whatever message it carries.
  if (data) {
    if (typeof data === "string") {
      const body = firstString(data);
      if (body) return body;
    }

    const message = firstString(data.message, data.error);
    if (message) return message;

    // express-validator / mongoose style: { errors: [{ msg | message }] }
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const first = data.errors[0];
      const nested =
        typeof first === "string"
          ? first
          : firstString(first?.msg, first?.message);
      if (nested) return nested;
    }
  }

  // No response body at all: distinguish "server unreachable" from the rest.
  if (!error.response) {
    if (error.code === "ERR_NETWORK") {
      return "Cannot reach the server. Please check your connection and try again.";
    }
    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }
  }

  return fallback;
}

export default getErrorMessage;
