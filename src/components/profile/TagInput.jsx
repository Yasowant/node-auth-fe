import { useId, useState } from "react";

import { CloseIcon } from "../icons";

/** Type and press Enter to add. Used for skills and preferred locations. */
const TagInput = ({ label, hint, span = 2, values, onChange, placeholder }) => {
  const id = useId();
  const [text, setText] = useState("");

  const add = () => {
    const value = text.trim();
    if (!value) return;

    if (!values.some((item) => item.toLowerCase() === value.toLowerCase())) {
      onChange([...values, value]);
    }

    setText("");
  };

  const remove = (value) => onChange(values.filter((item) => item !== value));

  return (
    <div className="pf-field" style={{ gridColumn: `span ${span}` }}>
      <label htmlFor={id}>{label}</label>

      <div className="tag-editor">
        {values.map((value) => (
          <span className="tag tag-removable" key={value}>
            {value}
            <button type="button" onClick={() => remove(value)}>
              <CloseIcon width="11" height="11" />
              <span className="visually-hidden">Remove {value}</span>
            </button>
          </span>
        ))}

        <input
          id={id}
          className="tag-entry"
          value={text}
          placeholder={values.length ? "Add another" : placeholder}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              add();
            }

            if (event.key === "Backspace" && !text && values.length) {
              onChange(values.slice(0, -1));
            }
          }}
          onBlur={add}
        />
      </div>

      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
};

export default TagInput;
