import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // wait 300ms after the user stops typing, so we don't call the API on every key
    const timer = setTimeout(() => {
      setLoading(true);
      setError("");
      api
        .get("/products/", { params: { search } })
        .then((res) => setProducts(res.data))
        .catch((err) =>
          setError(err.response?.data?.detail || "Could not load products.")
        )
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div>
      <SearchBar value={search} onChange={setSearch} />
      <h2>Products</h2>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p>No products found{search && ` for "${search}"`}.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {!loading && products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}