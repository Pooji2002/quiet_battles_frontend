import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [message] = useState(location.state?.message || "");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      if (!data.accessToken) {
        throw new Error("Access token was not received.");
      }

      if (data.role !== "USER") {
        throw new Error(
          "This login is for customers. Please use Admin Login for administrator access."
        );
      }

      localStorage.setItem("qbAccessToken", data.accessToken);

      localStorage.setItem(
        "qbUser",
        JSON.stringify({
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          tokenType: data.tokenType,
        })
      );

      window.dispatchEvent(new Event("qb-auth-changed"));

      const destination = location.state?.from || "/";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleLogin}>
        <p className="auth-brand">QUIET BATTLES™</p>
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">
          Sign in to continue your journey.
        </p>

        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;