import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUserRole(localStorage.getItem("role"));
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserName(userData.name || userData.email || "");
        } catch (e) {
          setUserName("");
        }
      }
    };

    // Listen for custom auth change event (fires immediately on same tab)
    window.addEventListener("authChange", handleAuthChange);

    // Also listen for storage changes (for multi-tab scenarios)
    window.addEventListener("storage", handleAuthChange);

    handleAuthChange(); // Initialize on mount

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName("");
    setIsMenuOpen(false);
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        {/* Brand/Logo */}
        <Link to="/elder-dashboard" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-icon">
            <i className="fas fa-heart"></i>
          </div>
          <div className="brand-text">
            <span className="brand-name">Vatsal</span>
            <span className="brand-subtitle">Elder Care</span>
          </div>
        </Link>

        {/* Hamburger Menu */}
        <button
          className={`hamburger ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          {isLoggedIn && userRole === "elder" && (
            <>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/elder-dashboard"
                  onClick={closeMenu}
                >
                  <i className="fas fa-home"></i>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/health" onClick={closeMenu}>
                  <i className="fas fa-heartbeat"></i>
                  Health Records
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/games" onClick={closeMenu}>
                  <i className="fas fa-gamepad"></i>
                  Games
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/yoga" onClick={closeMenu}>
                  <i className="fas fa-spa"></i>
                  Yoga
                </Link>
              </li>
            </>
          )}

          {isLoggedIn && userRole === "family" && (
            <>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/family-dashboard"
                  onClick={closeMenu}
                >
                  <i className="fas fa-home"></i>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/health" onClick={closeMenu}>
                  <i className="fas fa-file-medical"></i>
                  View Health
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link" to="/booking" onClick={closeMenu}>
                  <i className="fas fa-calendar"></i>
                  Doctor Booking
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link className="nav-link" to="/chatbot" onClick={closeMenu}>
                  <i className="fas fa-comments"></i>
                  Support
                </Link>
              </li> */}
            </>
          )}

          {isLoggedIn &&
            (userRole === "doctor" ||
              userRole === "companion" ||
              userRole === "nurse") && (
              <>
                {/* <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/doctor-dashboard"
                    onClick={closeMenu}
                  >
                    <i className="fas fa-stethoscope"></i>
                    My Bookings
                  </Link>
                </li> */}
              </>
            )}

          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login" onClick={closeMenu}>
                  <i className="fas fa-sign-in-alt"></i>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link nav-link-signup"
                  to="/signup"
                  onClick={closeMenu}
                >
                  <i className="fas fa-user-plus"></i>
                  Signup
                </Link>
              </li>
            </>
          )}

          {isLoggedIn && (
            <li className="nav-item">
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <button
                  className="logout-btn"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
