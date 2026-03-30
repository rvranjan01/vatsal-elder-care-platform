import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function CompanionList() {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const dummyCompanions = [
    {
      _id: "dummy1",
      name: "Anita Sharma",
      email: "anita@example.com",
      phone: "9876543210",
      gender: "Female",
      age: 32,
      experience: "4 years",
      specialization: "Elder companionship, daily support",
      address: "Bengaluru",
      bio: "Friendly and experienced companion for elder care and support."
    },
    {
      _id: "dummy2",
      name: "Rahul Verma",
      email: "rahul@example.com",
      phone: "9123456780",
      gender: "Male",
      age: 29,
      experience: "3 years",
      specialization: "Mobility assistance, home visits",
      address: "Bengaluru",
      bio: "Patient and dependable caregiver with home visit experience."
    }
  ];

  useEffect(() => {
    fetchCompanions();
  }, []);

  const fetchCompanions = async () => {
    try {
      const res = await API.get("/companions");
      const data = res.data.companions || [];

      if (data.length > 0) {
        setCompanions(data);
      } else {
        setCompanions(dummyCompanions);
      }
    } catch (err) {
      console.error("Error fetching companions:", err);
      setCompanions(dummyCompanions);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading companions...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Companions</h2>

      <div className="row">
        {companions.map((companion) => (
          <div key={companion._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5>{companion.name}</h5>
                <p><strong>Experience:</strong> {companion.experience || "N/A"}</p>
                <p><strong>Specialization:</strong> {companion.specialization || "General care"}</p>
                <p><strong>Location:</strong> {companion.address || "N/A"}</p>

                <div className="d-flex gap-2 mt-3">
                  <Link
                    to={`/companions/${companion._id}`}
                    state={{ companion }}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Profile
                  </Link>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      navigate(`/companions/${companion._id}/book`, {
                        state: { companion }
                      })
                    }
                  >
                    Book
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

export default CompanionList;