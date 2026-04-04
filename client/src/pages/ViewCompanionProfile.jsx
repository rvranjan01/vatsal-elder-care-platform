import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import API from "../services/api";
import "./DoctorProfile.css";

function ViewCompanionProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [companion, setCompanion] = useState(location.state?.companion || null);
  const [loading, setLoading] = useState(!location.state?.companion);

  const dummyProfiles = {
    dummy1: {
      _id: "dummy1",
      name: "Anita Sharma",
      email: "anita@example.com",
      specialty: "Elder companionship",
      experience: "4 years",
      certifications: "Senior Care, First Aid",
      licenseNumber: "N/A",
      bio: "Friendly and experienced companion for emotional support and daily assistance.",
      address: "Bengaluru",
    },
    dummy2: {
      _id: "dummy2",
      name: "Rahul Verma",
      email: "rahul@example.com",
      specialty: "Home support and mobility help",
      experience: "3 years",
      certifications: "Basic Caregiving",
      licenseNumber: "N/A",
      bio: "Reliable companion experienced in mobility assistance and home visits.",
      address: "Bengaluru",
    },
  };

  useEffect(() => {
    if (!companion) {
      fetchCompanionProfile();
    }
  }, [id]);

  const fetchCompanionProfile = async () => {
    try {
      const res = await API.get(`/companions/${id}`);
      setCompanion(res.data.companion);
    } catch (err) {
      console.error("Error fetching companion profile:", err);
      setCompanion(dummyProfiles[id] || null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading companion profile...</div>;
  }

  if (!companion) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Companion not found.</div>
      </div>
    );
  }

  const isDummy = companion._id?.startsWith("dummy");

  return (
    <div className="container mt-4">
      <div className="card profile-card p-4">
        <h3 className="mb-3">🤝 Companion Profile</h3>

        <label>Name</label>
        <input type="text" value={companion.name || ""} disabled />

        <label>Email</label>
        <input type="email" value={companion.email || ""} disabled />

        <label>Specialty</label>
        <input type="text" value={companion.specialty || ""} disabled />

        <label>Experience</label>
        <input type="text" value={companion.experience || ""} disabled />

        <label>Certifications</label>
        <input type="text" value={companion.certifications || ""} disabled />

        <label>License Number</label>
        <input type="text" value={companion.licenseNumber || ""} disabled />

        {companion.address && (
          <>
            <label>Address</label>
            <input type="text" value={companion.address} disabled />
          </>
        )}

        {companion.bio && (
          <>
            <label>Bio</label>
            <textarea value={companion.bio} disabled rows="4" />
          </>
        )}

        <div className="mt-3">
          <button
            className="btn btn-primary"
            disabled={isDummy}
            onClick={() =>
              navigate(`/companions/${companion._id}/book`, {
                state: { companion },
              })
            }
          >
            {isDummy ? "Demo Only" : "Book Companion"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewCompanionProfile;
