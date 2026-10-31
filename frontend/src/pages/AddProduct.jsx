import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProductForm from "../components/ProductForm";

export default function AddProduct() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    await api.post("/products/create/", values);
    navigate("/");
  };

  return (
    <div>
      <Link to="/">&larr; Back to products</Link>
      <h2>Add Product</h2>
      <ProductForm
        initialValues={{ name: "", price: "", description: "" }}
        onSubmit={handleSubmit}
        submitLabel="Add Product"
      />
    </div>
  );
}