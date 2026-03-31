import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function NurseBooking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const nurse = location.state?.nurse;

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const [formData, setFormData] = useState({
    nurseId: id,
    nurseName: nurse?.name || "",
    elderName: "",
    elderAge: "",
    serviceType: "Nurse",
    appointmentDate: "",
    timeSlot: "",
    address: "",
    careType: "",
    medicalNeeds: "",
    notes: "",
  });

  useEffect(() => {
    fetchElderProfile();
  }, []);

  const fetchElderProfile = async () => {
    try {
      const res = await API.get("/users/me");
      const user = res.data.user;

      setFormData((prev) => ({
        ...prev,
        elderName: user.name || "",
        elderAge: user.age || "",
        address: user.address || "",
      }));
    } catch (err) {
      console.error("Error fetching elder profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/bookings/book-nurse", formData);

      alert("Nurse booking request sent successfully ✅");
      navigate("/elder-dashboard");
    } catch (err) {
      console.error("Nurse booking error:", err);
      alert(err.response?.data?.message || "Failed to book nurse");
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return <div className="container mt-4">Loading booking form...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h2 className="mb-3">Book Nurse</h2>

        {nurse && (
          <div className="alert alert-info">
            Booking for: <strong>{nurse.name}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Elder Name</label>
            <input
              type="text"
              name="elderName"
              className="form-control"
              value={formData.elderName}
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Elder Age</label>
            <input
              type="number"
              name="elderAge"
              className="form-control"
              value={formData.elderAge}
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Appointment Date</label>
            <input
              type="date"
              name="appointmentDate"
              className="form-control"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Time Slot</label>
            <select
              name="timeSlot"
              className="form-select"
              value={formData.timeSlot}
              onChange={handleChange}
              required
            >
              <option value="">Select time slot</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Care Type</label>
            <select
              name="careType"
              className="form-select"
              value={formData.careType}
              onChange={handleChange}
              required
            >
              <option value="">Select care type</option>
              <option value="General Care">General Care</option>
              <option value="Post-Surgery Care">Post-Surgery Care</option>
              <option value="Injection / Dressing">Injection / Dressing</option>
              <option value="Vitals Monitoring">Vitals Monitoring</option>
              <option value="Elder Assistance">Elder Assistance</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Medical Needs</label>
            <textarea
              name="medicalNeeds"
              className="form-control"
              value={formData.medicalNeeds}
              onChange={handleChange}
              rows="3"
              placeholder="Describe care needs, condition, support required..."
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Additional instructions..."
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NurseBooking;