import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function NursesList() {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const dummyNurses = [
    {
      _id: "dummy1",
      name: "Nurse Kavya",
      email: "kavya@example.com",
      phone: "9876543210",
      gender: "Female",
      age: 30,
      experience: "5 years",
      specialty: "Home Care Nurse",
      address: "Bengaluru",
      bio: "Experienced in elder home care and daily health support.",
    },
    {
      _id: "dummy2",
      name: "Nurse Deepa",
      email: "deepa@example.com",
      phone: "9123456780",
      gender: "Female",
      age: 34,
      experience: "7 years",
      specialty: "Medication Support Nurse",
      address: "Bengaluru",
      bio: "Specialized in medication routines and patient support.",
    },
  ];

  useEffect(() => {
    fetchNurses();
  }, []);

  const fetchNurses = async () => {
    try {
      const res = await API.get("/nurses");
      const data = res.data.nurses || [];

      if (data.length > 0) {
        setNurses(data);
      } else {
        setNurses(dummyNurses);
      }
    } catch (err) {
      console.error("Error fetching nurses:", err);
      setNurses(dummyNurses);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading nurses...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Nurses</h2>

      <div className="row">
        {nurses.map((nurse) => (
          <div key={nurse._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5>{nurse.name}</h5>
                <p>
                  <strong>Specialty:</strong>{" "}
                  {nurse.specialty || "General care"}
                </p>
                <p>
                  <strong>Experience:</strong> {nurse.experience || "N/A"}
                </p>
                <p>
                  <strong>Location:</strong> {nurse.address || "N/A"}
                </p>

                <div className="d-flex gap-2 mt-3">
                  <Link
                    to={`/nurses/${nurse._id}`}
                    state={{ nurse }}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Profile
                  </Link>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      navigate(`/nurses/${nurse._id}/book`, {
                        state: { nurse },
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

export default NursesList;
