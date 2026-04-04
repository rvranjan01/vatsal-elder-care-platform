import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import API from "../services/api";
import "./DoctorProfile.css";

function ViewDoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [loading, setLoading] = useState(!location.state?.doctor);

  const dummyDoctors = {
    doctor1: {
      _id: "doctor1",
      name: "Dr. Amit Verma",
      email: "amit.verma@example.com",
      specialty: "General Physician",
      experience: "10 years",
      certifications: "MBBS, MD",
      licenseNumber: "DOC-1001",
      bio: "Experienced general physician focused on elderly care and regular health checkups.",
      address: "Bengaluru",
    },
    doctor2: {
      _id: "doctor2",
      name: "Dr. Sneha Reddy",
      email: "sneha.reddy@example.com",
      specialty: "Cardiologist",
      experience: "8 years",
      certifications: "MBBS, DM Cardiology",
      licenseNumber: "DOC-1002",
      bio: "Specialist in heart health, blood pressure management, and preventive cardiac care.",
      address: "Bengaluru",
    },
    doctor3: {
      _id: "doctor3",
      name: "Dr. Kiran Rao",
      email: "kiran.rao@example.com",
      specialty: "Orthopedic Specialist",
      experience: "9 years",
      certifications: "MBBS, MS Orthopedics",
      licenseNumber: "DOC-1003",
      bio: "Focused on joint pain, mobility issues, and bone health for senior citizens.",
      address: "Bengaluru",
    },
  };

  useEffect(() => {
    if (!doctor) {
      fetchDoctorProfile();
    }
  }, [id]);

  const fetchDoctorProfile = async () => {
    try {
      const res = await API.get(`/doctors/${id}`);
      setDoctor(res.data.doctor);
    } catch (err) {
      console.error("Error fetching doctor profile:", err);
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading doctor profile...</div>;
  }

  if (!doctor) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Doctor not found.</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card profile-card p-4">
        <h3 className="mb-3">🩺 Doctor Profile</h3>

        <label>Name</label>
        <input type="text" value={doctor.name || ""} disabled />

        <label>Email</label>
        <input type="email" value={doctor.email || ""} disabled />

        <label>Specialty</label>
        <input type="text" value={doctor.specialty || ""} disabled />

        <label>Experience</label>
        <input type="text" value={doctor.experience || ""} disabled />

        <label>Certifications</label>
        <input type="text" value={doctor.certifications || ""} disabled />

        <label>License Number</label>
        <input type="text" value={doctor.licenseNumber || ""} disabled />

        {doctor.address && (
          <>
            <label>Address</label>
            <input type="text" value={doctor.address} disabled />
          </>
        )}

        {doctor.bio && (
          <>
            <label>Bio</label>
            <textarea value={doctor.bio} disabled rows="4" />
          </>
        )}

        <div className="mt-3">
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`/doctors/${doctor._id}/book`, {
                state: { doctor },
              })
            }
          >
            Book Doctor
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewDoctorProfile;
