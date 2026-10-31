import { useState } from "react";

// the backend returns {"name": ["This field may not be blank."]} for bad input
const formatError = (err) => {
  const data = err.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (data.detail) return data.detail;
  return Object.entries(data)
    .map(([field, msgs]) => `${field}: ${[].concat(msgs).join(" ")}`)
    .join("\n");
};

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: 12,
  padding: 8,
  boxSizing: "border-box",
};

export default function ProductForm({ initialValues, onSubmit, submitLabel }) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(formatError(err));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      <input
        name="name"
        placeholder="Product name"
        value={values.name}
        onChange={handleChange}
        required
        style={inputStyle}
      />
      <input
        name="price"
        type="number"
        step="0.01"
        min="0"
        placeholder="Price"
        value={values.price}
        onChange={handleChange}
        required
        style={inputStyle}
      />
      <textarea
        name="description"
        placeholder="Description"
        rows={5}
        value={values.description}
        onChange={handleChange}
        required
        style={inputStyle}
      />
      {error && <p style={{ color: "red", whiteSpace: "pre-line" }}>{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}