import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { cartFailure, setCart } from "../store/cartSlice";

export default function ProductDetail() {
  const dispatch = useDispatch();
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
            : "Could not load this product.",
        ),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    setMessage("");
    setAdding(true);
    try {
      const res = await api.post("/cart/add/", { product_id: product.id });
      dispatch(setCart(res.data));
      setMessage("Added to cart.");
    } catch (err) {
      const message = err.response?.data?.detail || "Could not add to cart.";
      dispatch(cartFailure(message));
      setMessage(message);
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
