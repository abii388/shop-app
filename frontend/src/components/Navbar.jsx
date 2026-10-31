import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
      <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
        Shop
      </Link>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}