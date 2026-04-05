import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

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
        alert("Registration successful!");
      }
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mb-5">
      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="text-center mb-4">Signup</h3>

            <form onSubmit={handleSignup}>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <select
                className="form-control mb-3"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="elder">Elder</option>
                <option value="family">Family Member</option>
                <option value="doctor">Doctor (Requires Admin Approval)</option>
                <option value="companion">
                  Companion/Caregiver (Requires Admin Approval)
                </option>
                <option value="nurse">Nurse (Requires Admin Approval)</option>
              </select>

              {/* Elder → ask username */}
              {role === "elder" && (
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Create Unique Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              )}

              {/* Family → ask elder username */}
              {role === "family" && (
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter Elder Username"
                  value={elderUsername}
                  onChange={(e) => setElderUsername(e.target.value)}
                  required
                />
              )}

              {/* Providers → info message */}
              {["doctor", "companion", "nurse"].includes(role) && (
                <div className="alert alert-info small mb-3">
                  Your account will be pending admin verification. Once
                  approved, you'll be visible to families and elders in the
                  system.
                </div>
              )}

              {/* Provider fields */}
              {role === "doctor" && (
                <>
                  {/* <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Specialty (e.g., Geriatrics)"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                  /> */}

                  <select
                    className="form-control mb-3"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                  >
                    <option value="General">General</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Orthopedist">Orthopedist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="Dentist">Dentist</option>
                  </select>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="License / Registration Number"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </>
              )}

              {role === "companion" && (
                <>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Years of experience / Short bio"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Certifications (if any)"
                    value={certifications}
                    onChange={(e) => setCertifications(e.target.value)}
                  />
                </>
              )}

              {role === "nurse" && (
                <>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Specialty / Qualification"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Years of experience / Short bio"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </>
              )}

              <button className="btn btn-success w-100" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Signup"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
