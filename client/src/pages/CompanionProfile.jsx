import { useState, useEffect } from "react";
import API from "../services/api";
import "./DoctorProfile.css";

function CompanionProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "",
    experience: "",
    certifications: "",
    licenseNumber: ""
  });

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");
      const user = res.data.user;

      setFormData({
        name: user.name || "",
        email: user.email || "",
        specialty: user.specialty || "",
        experience: user.experience || "",
        certifications: user.certifications || "",
        licenseNumber: user.licenseNumber || ""
      });
    } catch (err) {
      console.error("Error fetching profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      await API.put("/users/update", formData);
      alert("Profile updated successfully ✅");
      setEditMode(false);
    } catch (err) {
      alert("Failed to update profile ❌");
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading profile...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card profile-card p-4">
        <h3 className="mb-3">🤝 Companion Profile</h3>

        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          disabled={!editMode}
          onChange={handleChange}
        />

        <label>Email</label>
        <input type="email" value={formData.email} disabled />

        <label>Specialty</label>
        <input
          type="text"
          name="specialty"
          value={formData.specialty}
          disabled={!editMode}
          onChange={handleChange}
        />

        <label>Experience</label>
        <input
          type="text"
          name="experience"
          value={formData.experience}
          disabled={!editMode}
          onChange={handleChange}
        />

        <label>Certifications</label>
        <input
          type="text"
          name="certifications"
          value={formData.certifications}
          disabled={!editMode}
          onChange={handleChange}
        />

        <label>License Number</label>
        <input
          type="text"
          name="licenseNumber"
          value={formData.licenseNumber}
          disabled={!editMode}
          onChange={handleChange}
        />

        <div className="mt-3">
          {!editMode ? (
            <button
              className="btn btn-primary"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button className="btn btn-success me-2" onClick={handleSave}>
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditMode(false);
                  fetchProfile();
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanionProfile;