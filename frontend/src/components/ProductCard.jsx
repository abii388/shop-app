import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const shorten = (text, max = 80) =>
  text.length > max ? text.slice(0, max).trim() + "..." : text;

export default function ProductCard({ product,onDelete }) {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
      <Link
        to={`/products/${product.id}`}
        style={{ display: "block", textDecoration: "none", color: "inherit" }}
      >
        <h3 style={{ margin: "0 0 8px" }}>{product.name}</h3>
        <p style={{ margin: "0 0 8px", fontWeight: "bold" }}>₹{product.price}</p>
        <p style={{ margin: 0, color: "#555" }}>{shorten(product.description)}</p>
      </Link>

      {user?.is_admin && (
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
            Edit
          </button>
           <button onClick={() => onDelete(product)}>Delete</button>
        </div>
      )}
    </div>
  );
}