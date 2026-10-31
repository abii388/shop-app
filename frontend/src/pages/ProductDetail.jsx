import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);

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

  const handleAddToCart = async () => {
    setMessage("");
    setAdding(true);
    try {
      await api.post("/cart/add/", { product_id: product.id });
      setMessage("Added to cart.");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Could not add to cart.");
    } finally {
      setAdding(false);
    }
  };

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
      <button onClick={handleAddToCart} disabled={adding}>
        {adding ? "Adding..." : "Add to Cart"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}