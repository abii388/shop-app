export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search products (e.g. phone, charger)"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "50%", padding: 10, marginBottom: 20, boxSizing: "border-box" }}
    />
  );
}