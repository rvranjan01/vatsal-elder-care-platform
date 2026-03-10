import { useState, useEffect } from "react";
import API from "../services/api";
import "./ProviderDashboard.css";

function ProviderDashboard() {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchBookings();
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Get pending bookings (awaiting provider confirmation)
      const pendingRes = await API.get("/bookings/pending");
      const pending = Array.isArray(pendingRes.data.bookings) ? pendingRes.data.bookings : [];
      
      // Filter: only show Pending Confirmation status
      const waitingForConfirm = pending.filter(b => b.confirmationStatus === "Waiting");
      setPendingBookings(waitingForConfirm);
      
      // Get all user's bookings and filter for confirmed ones
      const allBookingsRes = await API.get("/bookings/my-bookings");
      const allBookings = Array.isArray(allBookingsRes.data.bookings) ? allBookingsRes.data.bookings : [];
      
      const confirmed = allBookings.filter(b => b.confirmationStatus === "Confirmed" && b.status === "Confirmed");
      setConfirmedBookings(confirmed);
      
      console.log("Pending for confirmation:", waitingForConfirm);
      console.log("Already confirmed:", confirmed);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (booking) => {
    setSelectedBooking(booking);
    setNotes("");
    setShowConfirmModal(true);
  };

  const openRejectModal = (booking) => {
    setSelectedBooking(booking);
    setNotes("");
    setShowRejectModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedBooking) return;

    try {
      await API.put(`/bookings/${selectedBooking._id}/confirm`, { notes });
      alert("Booking confirmed! Family has been notified.");
      setShowConfirmModal(false);
      setSelectedBooking(null);
      setNotes("");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to confirm booking");
    }
  };

  const handleRejectBooking = async () => {
    if (!selectedBooking) return;

    try {
      await API.put(`/bookings/${selectedBooking._id}/reject`, { notes });
      alert("Booking rejected. Family has been notified.");
      setShowRejectModal(false);
      setSelectedBooking(null);
      setNotes("");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject booking");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    return timeStr.substring(0, 5); // HH:MM format
  };

  return (
    <div className="container-fluid mt-4 mb-4">
      <h3 className="mb-4">
        <i className="bi bi-briefcase"></i> Provider Dashboard
      </h3>

      {loading && <div className="alert alert-info">Loading bookings...</div>}

      {/* Tab Navigation */}
      <div className="nav nav-tabs mb-4" role="tablist">
        <button
          className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
          role="tab"
        >
          <span className="badge bg-warning text-dark me-2">{pendingBookings.length}</span>
          Pending Confirmation
        </button>
        <button
          className={`nav-link ${activeTab === "confirmed" ? "active" : ""}`}
          onClick={() => setActiveTab("confirmed")}
          role="tab"
        >
          <span className="badge bg-success me-2">{confirmedBookings.length}</span>
          Confirmed Bookings
        </button>
      </div>

      {/* Pending Bookings Tab */}
      {activeTab === "pending" && (
        <div className="pd-tab-content">
          {pendingBookings.length === 0 ? (
            <div className="alert alert-info">No pending bookings awaiting your confirmation.</div>
          ) : (
            <div className="row g-3">
              {pendingBookings.map((booking) => (
                <div key={booking._id} className="col-md-6 col-lg-4">
                  <div className="card pd-booking-card border-warning">
                    <div className="card-header bg-warning text-dark">
                      <h6 className="mb-0">
                        <i className="bi bi-exclamation-circle"></i> Awaiting Confirmation
                      </h6>
                    </div>
                    <div className="card-body">
                      <p className="mb-2">
                        <strong>Family Member:</strong><br />
                        {booking.familyName || booking.familyId}
                      </p>
                      <p className="mb-2">
                        <strong>Elder:</strong><br />
                        {booking.elderName || booking.elderId}
                      </p>
                      <p className="mb-2">
                        <strong>Service Type:</strong>
                        <span className="badge bg-secondary ms-2">{booking.serviceType}</span>
                      </p>
                      <p className="mb-2">
                        <strong>Date:</strong> {formatDate(booking.appointmentDate)}
                      </p>
                      {booking.timeSlot && (
                        <p className="mb-2">
                          <strong>Time:</strong> {formatTime(booking.timeSlot)}
                        </p>
                      )}
                      {booking.notes && (
                        <p className="mb-2">
                          <strong>Notes:</strong><br />
                          <small className="text-muted">{booking.notes}</small>
                        </p>
                      )}
                      <p className="mb-3">
                        <strong>Created:</strong> {formatDate(booking.createdAt)}
                      </p>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success flex-grow-1"
                          onClick={() => openConfirmModal(booking)}
                        >
                          <i className="bi bi-check-circle"></i> Accept
                        </button>
                        <button
                          className="btn btn-sm btn-danger flex-grow-1"
                          onClick={() => openRejectModal(booking)}
                        >
                          <i className="bi bi-x-circle"></i> Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmed Bookings Tab */}
      {activeTab === "confirmed" && (
        <div className="pd-tab-content">
          {confirmedBookings.length === 0 ? (
            <div className="alert alert-info">No confirmed bookings yet.</div>
          ) : (
            <div className="row g-3">
              {confirmedBookings.map((booking) => (
                <div key={booking._id} className="col-md-6 col-lg-4">
                  <div className="card pd-booking-card border-success">
                    <div className="card-header bg-success text-white">
                      <h6 className="mb-0">
                        <i className="bi bi-check-circle"></i> Confirmed
                      </h6>
                    </div>
                    <div className="card-body">
                      <p className="mb-2">
                        <strong>Family Member:</strong><br />
                        {booking.familyName || booking.familyId}
                      </p>
                      <p className="mb-2">
                        <strong>Elder:</strong><br />
                        {booking.elderName || booking.elderId}
                      </p>
                      <p className="mb-2">
                        <strong>Service Type:</strong>
                        <span className="badge bg-secondary ms-2">{booking.serviceType}</span>
                      </p>
                      <p className="mb-2">
                        <strong>Date:</strong> {formatDate(booking.appointmentDate)}
                      </p>
                      {booking.timeSlot && (
                        <p className="mb-2">
                          <strong>Time:</strong> {formatTime(booking.timeSlot)}
                        </p>
                      )}
                      {booking.notes && (
                        <p className="mb-2">
                          <strong>Notes:</strong><br />
                          <small className="text-muted">{booking.notes}</small>
                        </p>
                      )}
                      <p className="mb-0">
                        <strong>Confirmed:</strong> {formatDate(booking.confirmedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && selectedBooking && (
        <div className="pd-modal-backdrop">
          <div className="pd-modal">
            <h5 className="modal-title mb-3">Confirm Booking</h5>
            <p className="text-muted small">
              You are confirming this booking for <strong>{selectedBooking.elderName || selectedBooking.elderId}</strong>
            </p>
            <div className="mb-3">
              <label className="form-label">Add Notes (Optional)</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="e.g., Will arrive at 2:30 PM, brought medications..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-success flex-grow-1"
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </button>
              <button
                className="btn btn-secondary flex-grow-1"
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedBooking(null);
                  setNotes("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedBooking && (
        <div className="pd-modal-backdrop">
          <div className="pd-modal">
            <h5 className="modal-title mb-3">Decline Booking</h5>
            <p className="text-muted small">
              You are declining this booking for <strong>{selectedBooking.elderName || selectedBooking.elderId}</strong>
            </p>
            <div className="mb-3">
              <label className="form-label">Reason (Optional)</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="e.g., Unavailable on this date, scheduling conflict..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-danger flex-grow-1" onClick={handleRejectBooking}>
                Decline Booking
              </button>
              <button
                className="btn btn-secondary flex-grow-1"
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedBooking(null);
                  setNotes("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderDashboard;
