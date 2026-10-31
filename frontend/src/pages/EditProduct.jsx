import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import ProductForm from "../components/ProductForm";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleSubmit = async (values) => {
    await api.put(`/products/${id}/update/`, values);
    navigate("/");
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
      <h2>Edit Product</h2>
      <ProductForm
        initialValues={{
          name: product.name,
          price: product.price,
          description: product.description,
        }}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}