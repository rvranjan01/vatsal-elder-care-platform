import { useState, useEffect } from "react";
import API from "../services/api";
import "./Booking.css";

function Booking() {
  const [isCreating, setIsCreating] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    elderName: "",
    doctorName: "",
    specialty: "General Practitioner",
    consultationType: "In-person",
    appointmentDate: "",
    timeSlot: "09:00 AM",
    reason: "",
    medicalHistory: "",
    currentMedications: "",
    notes: ""
  });

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/bookings/my-bookings");
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.elderName || !formData.doctorName || !formData.appointmentDate || !formData.reason) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const res = await API.post("/bookings/create", formData);
      alert("Booking created successfully!");
      setBookings([...bookings, res.data.booking]);
      setFormData({
        elderName: "",
        doctorName: "",
        specialty: "General Practitioner",
        consultationType: "In-person",
        appointmentDate: "",
        timeSlot: "09:00 AM",
        reason: "",
        medicalHistory: "",
        currentMedications: "",
        notes: ""
      });
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(error.response?.data?.message || "Failed to create booking");
    }
  };

  const handleUpdateBooking = async (id) => {
    const booking = bookings.find(b => b._id === id);
    if (!booking) return;

    try {
      const res = await API.put(`/bookings/${id}`, {
        elderName: booking.elderName,
        doctorName: booking.doctorName,
        specialty: booking.specialty,
        consultationType: booking.consultationType,
        appointmentDate: booking.appointmentDate,
        timeSlot: booking.timeSlot,
        reason: booking.reason,
        medicalHistory: booking.medicalHistory,
        currentMedications: booking.currentMedications,
        notes: booking.notes
      });
      
      setBookings(bookings.map(b => b._id === id ? res.data.booking : b));
      setEditingId(null);
      alert("Booking updated successfully!");
    } catch (error) {
      console.error("Error updating booking:", error);
      alert(error.response?.data?.message || "Failed to update booking");
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await API.delete(`/bookings/cancel/${id}`);
      setBookings(bookings.map(b => b._id === id ? { ...b, status: "Cancelled" } : b));
      alert("Booking cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    try {
      await API.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b._id !== id));
      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert(error.response?.data?.message || "Failed to delete booking");
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      "Pending": "badge-warning",
      "Confirmed": "badge-success",
      "Completed": "badge-info",
      "Cancelled": "badge-danger"
    };
    return statusColors[status] || "badge-secondary";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="booking-container">
      <h2 className="mb-4">Doctor Appointment Booking</h2>

      {/* Create Booking Button */}
      <div className="mb-4">
        <button
          className="btn btn-primary"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? "Cancel" : "📅 New Booking"}
        </button>
      </div>

      {/* Create Booking Form */}
      {isCreating && (
        <div className="card shadow mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Create New Booking</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreateBooking}>
              <div className="row">
                {/* Elder Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Elder Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="elderName"
                    value={formData.elderName}
                    onChange={handleInputChange}
                    placeholder="Enter elder's name"
                    required
                  />
                </div>

                {/* Doctor Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Doctor Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    placeholder="Enter doctor's name"
                    required
                  />
                </div>
              </div>

              <div className="row">
                {/* Specialty */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Specialty *</label>
                  <select
                    className="form-select"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="General Practitioner">General Practitioner</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Orthopedist">Orthopedist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="Dentist">Dentist</option>
                  </select>
                </div>

                {/* Consultation Type */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Consultation Type *</label>
                  <select
                    className="form-select"
                    name="consultationType"
                    value={formData.consultationType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="In-person">In-person</option>
                    <option value="Video Call">Video Call</option>
                    <option value="Home Visit">Home Visit</option>
                  </select>
                </div>
              </div>

              <div className="row">
                {/* Appointment Date */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Appointment Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Time Slot */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Time Slot *</label>
                  <select
                    className="form-select"
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Reason for Visit */}
              <div className="mb-3">
                <label className="form-label">Reason for Visit *</label>
                <textarea
                  className="form-control"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Describe the reason for the appointment"
                  rows="3"
                  required
                ></textarea>
              </div>

              {/* Medical History */}
              <div className="mb-3">
                <label className="form-label">Medical History</label>
                <textarea
                  className="form-control"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  placeholder="Enter relevant medical history (e.g., past surgeries, chronic diseases)"
                  rows="2"
                ></textarea>
              </div>

              {/* Current Medications */}
              <div className="mb-3">
                <label className="form-label">Current Medications</label>
                <textarea
                  className="form-control"
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleInputChange}
                  placeholder="List all current medications and dosages"
                  rows="2"
                ></textarea>
              </div>

              {/* Additional Notes */}
              <div className="mb-3">
                <label className="form-label">Additional Notes</label>
                <textarea
                  className="form-control"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional notes or special requirements"
                  rows="2"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-success w-100">
                Create Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div>
        <h4 className="mb-3">Your Bookings</h4>
        {loading ? (
          <p className="text-center text-muted">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-muted">No bookings yet. Create one to get started!</p>
        ) : (
          <div className="row">
            {bookings.map((booking) => (
              <div key={booking._id} className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{booking.doctorName} - {booking.specialty}</h5>
                    <span className={`badge ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="card-body">
                    {editingId === booking._id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdateBooking(booking._id);
                        }}
                      >
                        <div className="mb-2">
                          <input
                            type="text"
                            className="form-control form-control-sm mb-2"
                            value={booking.elderName}
                            onChange={(e) =>
                              setBookings(
                                bookings.map((b) =>
                                  b._id === booking._id ? { ...b, elderName: e.target.value } : b
                                )
                              )
                            }
                            placeholder="Elder Name"
                          />
                          <input
                            type="text"
                            className="form-control form-control-sm mb-2"
                            value={booking.reason}
                            onChange={(e) =>
                              setBookings(
                                bookings.map((b) =>
                                  b._id === booking._id ? { ...b, reason: e.target.value } : b
                                )
                              )
                            }
                            placeholder="Reason"
                          />
                          <input
                            type="date"
                            className="form-control form-control-sm mb-2"
                            value={booking.appointmentDate.slice(0, 10)}
                            onChange={(e) =>
                              setBookings(
                                bookings.map((b) =>
                                  b._id === booking._id ? { ...b, appointmentDate: e.target.value } : b
                                )
                              )
                            }
                          />
                          <select
                            className="form-select form-select-sm mb-2"
                            value={booking.timeSlot}
                            onChange={(e) =>
                              setBookings(
                                bookings.map((b) =>
                                  b._id === booking._id ? { ...b, timeSlot: e.target.value } : b
                                )
                              )
                            }
                          >
                            <option value="09:00 AM">09:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="02:00 PM">02:00 PM</option>
                            <option value="03:00 PM">03:00 PM</option>
                            <option value="04:00 PM">04:00 PM</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleUpdateBooking(booking._id)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <>
                        <p className="mb-1">
                          <strong>Elder:</strong> {booking.elderName}
                        </p>
                        <p className="mb-1">
                          <strong>Date:</strong> {formatDate(booking.appointmentDate)}
                        </p>
                        <p className="mb-1">
                          <strong>Time:</strong> {booking.timeSlot}
                        </p>
                        <p className="mb-1">
                          <strong>Type:</strong> {booking.consultationType}
                        </p>
                        <p className="mb-1">
                          <strong>Reason:</strong> {booking.reason}
                        </p>
                        {booking.medicalHistory && (
                          <p className="mb-1 text-muted small">
                            <strong>Medical History:</strong> {booking.medicalHistory}
                          </p>
                        )}
                        {booking.currentMedications && (
                          <p className="mb-1 text-muted small">
                            <strong>Medications:</strong> {booking.currentMedications}
                          </p>
                        )}
                        {booking.notes && (
                          <p className="mb-1 text-muted small">
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="card-footer bg-light">
                    {booking.status !== "Completed" && booking.status !== "Cancelled" && (
                      <>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => setEditingId(booking._id)}
                          disabled={editingId !== null}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger me-2"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteBooking(booking._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking;
