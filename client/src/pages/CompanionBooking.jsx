import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function CompanionBooking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const companion = location.state?.companion;

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const [formData, setFormData] = useState({
    companionId: id,
    elderName: "",
    elderAge: "",
    serviceType: "Companion",
    appointmentDate: "",
    timeSlot: "",
    address: "",
    notes: ""
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
        address: user.address || ""
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
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/bookings/book-companion", formData);

      alert("Companion booking request sent successfully ✅");
      navigate("/elder-dashboard");
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.response?.data?.message || "Failed to book companion");
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
        <h2 className="mb-3">Book Companion</h2>

        {companion && (
          <div className="alert alert-info">
            Booking for: <strong>{companion.name}</strong>
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
              onChange={handleChange}
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
              onChange={handleChange}
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

          {/* <div className="mb-3">
            <label className="form-label">Time Slot</label>
            <select
              name="timeSlot"
              className="form-select"
              value={formData.timeSlot}
              onChange={handleChange}
              required
            >
              <option value="">Select time slot</option>
              <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
              <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
              <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
              <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
              <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
              <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
            </select>
          </div> */}

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
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any special care instructions..."
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

export default CompanionBooking;