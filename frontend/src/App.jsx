import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetail from "./pages/ProductDetail";



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
      </Route>
    </Routes>
  );
}