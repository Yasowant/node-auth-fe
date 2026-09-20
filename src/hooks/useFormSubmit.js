import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Wraps an async submit handler with the boilerplate every auth form needs:
 * preventDefault, a submitting flag that is always cleared, and a normalised
 * error message. `onSubmit` receives no arguments and may return a value.
 */
export function useFormSubmit(handler, { fallbackMessage } = {}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const onSubmit = useCallback(
    async (event) => {
      event?.preventDefault();

      setError("");
      setSubmitting(true);

      try {
        return await handler();
      } catch (caught) {
        if (mountedRef.current) {
          setError(
            caught?.friendlyMessage ||
              fallbackMessage ||
              "Something went wrong. Please try again.",
          );
        }
        return undefined;
      } finally {
        // Always cleared -- otherwise a failed submit leaves the button
        // disabled forever.
        if (mountedRef.current) setSubmitting(false);
      }
    },
    [handler, fallbackMessage],
  );

  return { submitting, error, setError, onSubmit };
}

export default useFormSubmit;
