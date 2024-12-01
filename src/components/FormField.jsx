import PropTypes from "prop-types";
const FormField = ({ field, value, onChange }) => {
  return (
    <div className="form-group">
      <label htmlFor={field.name}>
        {field.label}
        {field.required && <span style={{ color: "red" }}> *</span>}
      </label>
      {field.type === "dropdown" ? (
        <select
          id={field.name}
          name={field.name}
          required={field.required}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          aria-label={field.label}
        >
          <option value="">Select</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={field.name}
          type={field.type}
          name={field.name}
          required={field.required}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          aria-label={field.label}
        />
      )}
    </div>
  );
};

FormField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["text", "number", "password", "email", "dropdown"])
      .isRequired,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FormField;
