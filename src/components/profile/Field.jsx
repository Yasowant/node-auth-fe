import { useId } from "react";

/** Label + control, sized by `span` on the section's field grid. */
const Field = ({
  label,
  hint,
  span = 1,
  as = "input",
  options,
  children,
  ...rest
}) => {
  const id = useId();

  return (
    <div className="pf-field" style={{ gridColumn: `span ${span}` }}>
      <label htmlFor={id}>{label}</label>

      {children ? (
        children
      ) : as === "textarea" ? (
        <textarea id={id} className="input" rows={5} {...rest} />
      ) : as === "select" ? (
        <select id={id} className="input" {...rest}>
          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input id={id} className="input" {...rest} />
      )}

      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
};

export default Field;
