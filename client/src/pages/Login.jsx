import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../styles/Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Dispatch custom event to notify navbar of login
      window.dispatchEvent(new Event("authChange"));

      if (res.data.user.role === "elder") {
        navigate("/elder-dashboard");
      } else if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (res.data.user.role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (res.data.user.role === "companion") {
        navigate("/companion-dashboard");
      } else if (res.data.user.role === "nurse") {
        navigate("/nurse-dashboard");
      } else if (res.data.user.role === "family") {
        navigate("/family-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="back-to-home">
        <i className="fas fa-arrow-left"></i>
        Back to Home
      </Link>

      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-icon">
            <i className="fas fa-heart"></i>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your Vatsal account</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              className="form-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="auth-btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Signing In...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/signup" className="auth-link auth-link-primary">
            <i className="fas fa-user-plus"></i>
            Don't have an account? Sign up here
          </Link>

          <a href="#" className="auth-link">
            <i className="fas fa-key"></i>
            Forgot your password?
          </a>

          <Link to="/" className="auth-link">
            <i className="fas fa-home"></i>
            Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
