import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUserRole(localStorage.getItem("role"));
    };

    // Listen for custom auth change event (fires immediately on same tab)
    window.addEventListener("authChange", handleAuthChange);
    
    // Also listen for storage changes (for multi-tab scenarios)
    window.addEventListener("storage", handleAuthChange);

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
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Vatsal - Elder Care
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isLoggedIn && userRole === "elder" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/elder-dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/health">
                    Health Records
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/games">
                    Games
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/yoga">
                    Yoga
                  </Link>
                </li>
              </>
            )}

            {isLoggedIn && userRole === "family" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/family-dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/health">
                    View Health
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/booking">
                    Doctor Booking
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/chatbot">
                    Chatbot Support
                  </Link>
                </li>
              </>
            )}

            {isLoggedIn && (userRole === "doctor" || userRole === "companion" || userRole === "nurse") && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/doctor-dashboard">
                    My Bookings
                  </Link>
                </li>
              </>
            )}

            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Signup
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;