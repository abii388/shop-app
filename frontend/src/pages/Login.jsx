import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice";
import "./Login.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { submitting, error } = useSelector((state) => state.auth);

  if (localStorage.getItem("token")) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(loginStart());

    try {
      const response = await api.post("/auth/login/", { email, password });
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      dispatch(loginSuccess(response.data.user));
      navigate("/");
    } catch (err) {
      dispatch(
        loginFailure(
          err.response?.data?.detail ||
            "Something went wrong. Please try again.",
        ),
      );
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Sign in to Shop App</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button className="login-button" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
