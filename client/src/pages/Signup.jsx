import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../styles/Auth.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("elder");
  const [username, setUsername] = useState("");
  const [elderUsername, setElderUsername] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState("");
  const [certifications, setCertifications] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
      };

      // Add role-specific fields
      if (role === "elder") {
        payload.username = username;
      } else if (role === "family") {
        payload.elderUsername = elderUsername;
      }
      // Providers (doctor, companion, nurse) just have name/email/password
      // Attach provider fields
      if (["doctor", "companion", "nurse"].includes(role)) {
        if (specialty) payload.specialty = specialty;
        if (experience) payload.experience = experience;
        if (certifications) payload.certifications = certifications;
        if (licenseNumber) payload.licenseNumber = licenseNumber;
      }
      await API.post("/auth/register", payload);

      // For providers, show info about pending activation
      if (["doctor", "companion", "nurse"].includes(role)) {
        alert(
          `Registration successful! Your account is pending admin activation. You will receive an email notification once approved.`,
        );
      } else {
        alert("Registration successful! Please login to continue.");
      }
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message || "Signup failed. Please try again.",
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
            <i className="fas fa-user-plus"></i>
          </div>
          <h1 className="auth-title">Join Vatsal</h1>
          <p className="auth-subtitle">Create your account to get started</p>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

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
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
            >
              <option value="elder">👴 Elder</option>
              <option value="family">👨‍👩‍👧‍👦 Family Member</option>
              <option value="doctor">
                👨‍⚕️ Doctor (Requires Admin Approval)
              </option>
              <option value="companion">
                🤝 Companion/Caregiver (Requires Admin Approval)
              </option>
              <option value="nurse">👩‍⚕️ Nurse (Requires Admin Approval)</option>
            </select>
          </div>

          {/* Elder → ask username */}
          {role === "elder" && (
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Create Unique Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}

          {/* Family → ask elder username */}
          {role === "family" && (
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Enter Elder's Username"
                value={elderUsername}
                onChange={(e) => setElderUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}

          {/* Providers → info message */}
          {["doctor", "companion", "nurse"].includes(role) && (
            <div className="alert-custom">
              <i className="fas fa-info-circle"></i>
              Your account will be pending admin verification. Once approved,
              you'll be visible to families and elders in the system.
            </div>
          )}

          {/* Provider fields */}
          {role === "doctor" && (
            <>
              <div className="form-group">
                <select
                  className="form-select"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Specialty</option>
                  <option value="General">🏥 General Medicine</option>
                  <option value="Cardiologist">❤️ Cardiology</option>
                  <option value="Orthopedist">🦴 Orthopedics</option>
                  <option value="Neurologist">🧠 Neurology</option>
                  <option value="Dermatologist">🩹 Dermatology</option>
                  <option value="Pediatrician">👶 Pediatrics</option>
                  <option value="Psychiatrist">🧠 Psychiatry</option>
                  <option value="Dentist">🦷 Dentistry</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="License / Registration Number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {role === "companion" && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Years of experience / Short bio"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Certifications (if any)"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {role === "nurse" && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Specialty / Qualification"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Years of experience / Short bio"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="auth-btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i>
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="auth-link auth-link-primary">
            <i className="fas fa-sign-in-alt"></i>
            Already have an account? Sign in here
          </Link>

          <Link to="/" className="auth-link">
            <i className="fas fa-home"></i>
            Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
