import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      if (data.role !== "ADMIN") {
        throw new Error("Admin access is required.");
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

      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <p className="admin-login-brand">QUIET BATTLES™</p>

        <h1>Admin Access</h1>

        <p>Sign in to manage your collection and archive.</p>

        {error && <div className="admin-login-error">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter admin email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;