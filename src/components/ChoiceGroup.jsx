import { useId } from "react";

/**
 * Radio group rendered as selectable cards.
 * options: [{ value, title, note }]
 */
const ChoiceGroup = ({ legend, name, value, onChange, options }) => {
  const legendId = useId();

  return (
    <div role="radiogroup" aria-labelledby={legendId}>
      <p className="field-legend" id={legendId}>
        {legend}
      </p>

      <div className="choice-group">
        {options.map((option) => (
          <label className="choice" key={option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required
            />
            <span className="choice-title">{option.title}</span>
            <span className="choice-note">{option.note}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ChoiceGroup;
