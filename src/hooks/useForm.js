import { useCallback, useRef, useState } from "react";

/**
 * Minimal controlled-form state. Inputs are matched by their `name`
 * attribute, so a form only needs one change handler.
 */
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  // Snapshot of the first-render values, used by reset().
  const initialRef = useRef(initialValues);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialRef.current);
  }, []);

  return { values, setValues, handleChange, reset };
}

export default useForm;
