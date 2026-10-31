import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/products/${id}/`)
      .then((res) => setProduct(res.data))
      .catch((err) =>
        setError(
          err.response?.status === 404
            ? "Product not found."
            : "Could not load this product."
        )
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <Link to="/">Back to products</Link>
      </div>
    );

  return (
    <div>
      <Link to="/">&larr; Back to products</Link>
      <h2>{product.name}</h2>
      <p style={{ fontSize: 24, fontWeight: "bold" }}>₹{product.price}</p>
      <p>{product.description}</p>
      <button>Add to Cart</button>
    </div>
  );
}