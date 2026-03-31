import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import API from "../services/api";
import "./DoctorProfile.css";

function ViewNurseProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [nurse, setNurse] = useState(location.state?.nurse || null);
  const [loading, setLoading] = useState(!location.state?.nurse);

  const dummyNurses = {
    nurse1: {
      _id: "nurse1",
      name: "Nurse Kavya",
      email: "kavya@example.com",
      specialty: "Home Care Nurse",
      experience: "6 years",
      certifications: "GNM, Elder Care",
      licenseNumber: "NUR-2001",
      bio: "Compassionate home care nurse experienced in senior wellness and daily health support.",
      address: "Bengaluru"
    },
    nurse2: {
      _id: "nurse2",
      name: "Nurse Deepa",
      email: "deepa@example.com",
      specialty: "Medication Support Nurse",
      experience: "5 years",
      certifications: "BSc Nursing, Medication Care",
      licenseNumber: "NUR-2002",
      bio: "Helps elders with medicine schedules, monitoring, and regular nursing support at home.",
      address: "Bengaluru"
    },
    nurse3: {
      _id: "nurse3",
      name: "Nurse Arjun",
      email: "arjun@example.com",
      specialty: "Elder Care Nurse",
      experience: "7 years",
      certifications: "BSc Nursing, Senior Patient Care",
      licenseNumber: "NUR-2003",
      bio: "Experienced in elder care assistance, mobility support, and day-to-day health observation.",
      address: "Bengaluru"
    }
  };

  useEffect(() => {
    if (!nurse) {
      fetchNurseProfile();
    }
  }, [id]);

  const fetchNurseProfile = async () => {
  try {
    const res = await API.get(`/users/${id}`);
    setNurse(res.data);
  } catch (err) {
    console.error("Error fetching nurse profile:", err);
    setNurse(null);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <div className="container mt-4">Loading nurse profile...</div>;
  }

  if (!nurse) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Nurse not found.</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card profile-card p-4">
        <h3 className="mb-3">🧑‍⚕️ Nurse Profile</h3>

        <label>Name</label>
        <input type="text" value={nurse.name || ""} disabled />

        <label>Email</label>
        <input type="email" value={nurse.email || ""} disabled />

        <label>Specialty</label>
        <input type="text" value={nurse.specialty || ""} disabled />

        <label>Experience</label>
        <input type="text" value={nurse.experience || ""} disabled />

        <label>Certifications</label>
        <input type="text" value={nurse.certifications || ""} disabled />

        <label>License Number</label>
        <input type="text" value={nurse.licenseNumber || ""} disabled />

        {nurse.address && (
          <>
            <label>Address</label>
            <input type="text" value={nurse.address} disabled />
          </>
        )}

        {nurse.bio && (
          <>
            <label>Bio</label>
            <textarea value={nurse.bio} disabled rows="4" />
          </>
        )}

        <div className="mt-3">
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`/nurses/${nurse._id}/book`, {
                state: { nurse }
              })
            }
          >
            Book Nurse
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewNurseProfile;