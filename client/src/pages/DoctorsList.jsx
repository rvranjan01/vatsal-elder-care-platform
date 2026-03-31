// src/pages/DoctorsList.jsx (or wherever your CompanionList lives)
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const dummyDoctors = [
    {
      _id: "dummy1",
      name: "Dr. Amit Verma",
      email: "amit@example.com",
      phone: "9876543210",
      gender: "Male",
      age: 45,
      experience: "15 years",
      specialty: "General Physician",
      address: "Bengaluru",
      bio: "Experienced general physician with elder care specialization."
    },
    {
      _id: "dummy2", 
      name: "Dr. Sneha Reddy",
      email: "sneha@example.com",
      phone: "9123456780",
      gender: "Female",
      age: 38,
      experience: "12 years",
      specialty: "Cardiologist",
      address: "Bengaluru",
      bio: "Heart specialist with extensive geriatric experience."
    }
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      const data = res.data.doctors || [];

      if (data.length > 0) {
        setDoctors(data);
      } else {
        setDoctors(dummyDoctors);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setDoctors(dummyDoctors);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading doctors...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Doctors</h2>
      
      <div className="row">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{doctor.name}</h5>
                <p><strong>Specialty:</strong> {doctor.specialty || "General Medicine"}</p>
                <p><strong>Experience:</strong> {doctor.experience || "N/A"}</p>
                <p><strong>Location:</strong> {doctor.address || "N/A"}</p>
                
                <div className="d-flex gap-2 mt-3">
                  <Link
                    to={`/doctors/${doctor._id}`}
                    state={{ doctor }}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Profile
                  </Link>
                  
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      navigate(`/doctors/${doctor._id}/book`, {
                        state: { doctor }
                      })
                    }
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorsList;