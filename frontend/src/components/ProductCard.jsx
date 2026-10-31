import { Link } from "react-router-dom";

const shorten = (text, max = 80) =>
  text.length > max ? text.slice(0, max).trim() + "..." : text;

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      style={{
        display: "block",
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <h3 style={{ margin: "0 0 8px" }}>{product.name}</h3>
      <p style={{ margin: "0 0 8px", fontWeight: "bold" }}>₹{product.price}</p>
      <p style={{ margin: 0, color: "#555" }}>{shorten(product.description)}</p>
    </Link>
  );
}