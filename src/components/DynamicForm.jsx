import { useState, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_RESPONSES from "../apiResponses";
import FormField from "./FormField";

const DynamicForm = () => {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleSelection = useCallback((formType) => {
    const selectedFields = API_RESPONSES[formType];
    if (selectedFields) {
      setFields(selectedFields);
      setFormData({});
      setProgress(0);
    }
    toast.info(`Loaded ${formType.replace(/([A-Z])/g, " $1")} form.`);
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      const requiredFields = fields.filter((field) => field.required);
      const filledFields = requiredFields.filter(
        (field) => updatedData[field.name]
      );
      setProgress((filledFields.length / requiredFields.length) * 100);
      return updatedData;
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const missingFields = fields.filter(
      (field) => field.required && !formData[field.name]
    );

    if (missingFields.length > 0) {
      toast.error("Please fill all required fields.");
      return;
    }

    setSubmittedData((prev) => [...prev, formData]);
    toast.success("Form submitted successfully!");
    setFields([]);
    setFormData({});
    setProgress(0);
  };

  const handleDelete = (index) => {
    setSubmittedData((prev) => prev.filter((_, i) => i !== index));
    toast.success("Entry deleted successfully.");
  };
  const handleEdit = (index) => {
    const dataToEdit = submittedData[index];
    setFormData(dataToEdit);
    setSubmittedData((prev) => prev.filter((_, i) => i !== index));
    setProgress(0);
    toast.info("Edit the form and resubmit.");
  };

  return (
    <div className="form-container">
      <header className="header">
        <h1>Dynamic Form Application</h1>
      </header>

      <div className="form-progress">
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p>{progress.toFixed(0)}% completed</p>
      </div>

      <div className="form-group">
        <label htmlFor="formType">Choose Form Type:</label>
        <select
          id="formType"
          onChange={(e) => handleSelection(e.target.value)}
          aria-label="Select Form Type"
        >
          <option value="">Select</option>
          <option value="userInfo">User Information</option>
          <option value="addressInfo">Address Information</option>
          <option value="paymentInfo">Payment Information</option>
        </select>
      </div>
      <form onSubmit={handleSubmit} aria-labelledby="form-type">
        {fields.length > 0 && (
          <>
            {fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={formData[field.name] || ""}
                onChange={handleChange}
              />
            ))}
            <div className="form-actions">
              <button className="submit-button">Submit</button>
            </div>
          </>
        )}
      </form>

      {submittedData.length > 0 && (
        <table aria-describedby="submitted-data">
          <thead>
            <tr>
              {Object.keys(submittedData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data, index) => (
              <tr key={index}>
                {Object.values(data).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
                <td>
                  <button
                    className="icon-button"
                    onClick={() => handleEdit(index)}
                    aria-label="Edit entry"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => handleDelete(index)}
                    aria-label="Delete entry"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <footer className="footer">
        <h1>&copy; 2024 Dynamic Form App</h1>
      </footer>
    </div>
  );
};

export default DynamicForm;
