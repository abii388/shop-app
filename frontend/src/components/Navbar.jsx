import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const count = useSelector((state) => state.cart.count);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        background: "#222",
        color: "#fff",
      }}
    >
      <Link
        to="/"
        style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}
      >
        Shop
      </Link>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link to="/cart" style={{ color: "#fff" }}>
          Cart
        </Link>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
