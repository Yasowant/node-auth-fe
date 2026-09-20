import { useId } from "react";

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  autoComplete,
  required = true,
  ...rest
}) => {
  const id = useId();

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        {...rest}
      />
    </div>
  );
};

export default FormField;
