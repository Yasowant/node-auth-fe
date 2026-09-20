import { EXPERIENCE_LEVELS, JOB_TYPES, WORK_MODES } from "../../data/jobs";

const CheckboxList = ({
  legend,
  name,
  values,
  selected,
  onToggle,
  labelOf,
}) => (
  <fieldset className="filter-block">
    <legend>{legend}</legend>

    {values.map((value) => {
      const id = typeof value === "string" ? value : value.id;
      const label = labelOf ? labelOf(value) : value;

      return (
        <label className="filter-option" key={id}>
          <input
            type="checkbox"
            checked={selected.includes(id)}
            onChange={() => onToggle(name, id)}
          />
          <span>{label}</span>
        </label>
      );
    })}
  </fieldset>
);

const FilterRail = ({ filters, onToggle, onClear, activeCount }) => (
  <aside className="filter-rail" aria-label="Filter jobs">
    <div className="filter-head">
      <h3>Filters</h3>
      {activeCount > 0 ? (
        <button type="button" className="link-button" onClick={onClear}>
          Clear all
        </button>
      ) : null}
    </div>

    <CheckboxList
      legend="Work mode"
      name="workModes"
      values={WORK_MODES}
      selected={filters.workModes}
      onToggle={onToggle}
    />

    <CheckboxList
      legend="Job type"
      name="types"
      values={JOB_TYPES}
      selected={filters.types}
      onToggle={onToggle}
    />

    <CheckboxList
      legend="Experience"
      name="levels"
      values={EXPERIENCE_LEVELS}
      selected={filters.levels}
      onToggle={onToggle}
      labelOf={(level) => level.label}
    />
  </aside>
);

export default FilterRail;
