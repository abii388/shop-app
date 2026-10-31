import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetail from "./pages/ProductDetail";
import AdminRoute from "./components/AdminRoute";
import AddProduct from "./pages/AddProduct";
 import Cart from "./pages/Cart";
       import EditProduct from "./pages/EditProduct";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
            
          </ProtectedRoute>
        }
      >
        
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      <Route path="/admin/products/new"
        element={
        <AdminRoute>
          <AddProduct />
        </AdminRoute>
  }
/>
      </Route>

// ...
<Route
  path="/admin/products/:id/edit"
  element={
    <AdminRoute>
      <EditProduct />
    </AdminRoute>
  }
/>
    </Routes>
  );
}