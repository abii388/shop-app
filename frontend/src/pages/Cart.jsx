import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Cart() {
  const [cart, setCart] = useState({ items: [], total: "0.00", count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/cart/")
      .then((res) => setCart(res.data))
      .catch((err) =>
        setError(err.response?.data?.detail || "Could not load cart.")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (itemId) => {
    setError("");
    try {
      const res = await api.delete(`/cart/remove/${itemId}/`);
      setCart(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not remove item.");
    }
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <div>
      <h2>Your Cart</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {cart.items.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/">Continue shopping</Link>
        </p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: 8 }}>Product</th>
                <th style={{ padding: 8 }}>Price</th>
                <th style={{ padding: 8 }}>Qty</th>
                <th style={{ padding: 8 }}>Subtotal</th>
                <th style={{ padding: 8 }}></th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>
                    <Link to={`/products/${item.product.id}`}>{item.product.name}</Link>
                  </td>
                  <td style={{ padding: 8 }}>₹{item.product.price}</td>
                  <td style={{ padding: 8 }}>{item.quantity}</td>
                  <td style={{ padding: 8 }}>₹{item.subtotal}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => handleRemove(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 style={{ textAlign: "right" }}>Total: ₹{cart.total}</h3>
        </>
      )}
    </div>
  );
}