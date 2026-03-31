import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function DoctorBooking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const [formData, setFormData] = useState({
    doctorId: id,
    doctorName: doctor?.name || "",
    specialty: doctor?.specialty || "",
    elderName: "",
    elderAge: "",
    elderId: "",
    serviceType: "Doctor",
    consultationType: "In-person",
    appointmentDate: "",
    timeSlot: "",
    reason: "",
    medicalHistory: "",
    notes: "",
  });

  useEffect(() => {
    fetchElderProfile();
    fetchDoctorDetails();
  }, []);

  const fetchDoctorDetails = async () => {
    try {
      const res = await API.get(`/doctors/${id}`);
      const doctorData = res.data.doctor;

      setFormData((prev) => ({
        ...prev,
        doctorId: doctorData._id || id,
        doctorName: doctorData.name || "",
        specialty: doctorData.specialty || "",
      }));
    } catch (err) {
      console.error("Error fetching doctor details:", err);
    }
  };

  const fetchElderProfile = async () => {
    try {
      const res = await API.get("/users/me");
      const user = res.data.user;

      setFormData((prev) => ({
        ...prev,
        elderName: user.name || "",
        elderAge: user.age || 60,
        elderId: user._id || "",
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

      const payload = {
        ...formData,
        elderAge: formData.elderAge ? Number(formData.elderAge) : null,
      };

      console.log("Submitting booking:", payload);

      await API.post("/bookings/create", payload);
      // console.log("Booking response:", res.data);

      alert("Doctor booking request sent successfully ✅");
      navigate("/elder-dashboard");
    } catch (err) {
      console.error("Doctor booking error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to book doctor");
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
        <h2 className="mb-3">Book Doctor</h2>

        <div className="alert alert-info">
          Booking for: <strong>{formData.doctorName}</strong> ({formData.specialty || "General"})
        </div>

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
            <label className="form-label">Consultation Type</label>
            <select
              name="consultationType"
              className="form-select"
              value={formData.consultationType}
              onChange={handleChange}
              required
            >
              <option value="In-person">In-person</option>
              <option value="Video Call">Video Call</option>
              <option value="Home Visit">Home Visit</option>
            </select>
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
            <label className="form-label">Reason</label>
            <textarea
              name="reason"
              className="form-control"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              placeholder="Describe symptoms or purpose of consultation"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Medical History</label>
            <textarea
              name="medicalHistory"
              className="form-control"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows="3"
              placeholder="Existing conditions, allergies, previous treatment..."
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
              placeholder="Any additional notes..."
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

export default DoctorBooking;