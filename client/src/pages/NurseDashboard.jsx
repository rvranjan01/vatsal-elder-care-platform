import { useState, useEffect } from "react";
import API from "../services/api";
import "./ProviderDashboard.css"; // ✅ reuse CSS

function NurseDashboard() {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [notes, setNotes] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const pendingRes = await API.get("/bookings/pending");
      const pending = pendingRes.data.bookings || [];

      const waiting = pending.filter(
        (b) => b.confirmationStatus === "Waiting"
      );
      setPendingBookings(waiting);

      const allRes = await API.get("/bookings/all");
      const allBookings = allRes.data.bookings || [];

      const confirmed = allBookings.filter(
        (b) =>
          b.confirmationStatus === "Confirmed" &&
          b.status === "Confirmed"
      );

      setConfirmedBookings(confirmed);

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

  const handleConfirm = async () => {
    try {
      await API.put(`/bookings/${selectedBooking._id}/confirm`, { notes });
      alert("Service Accepted ✅");
      setShowConfirmModal(false);
      fetchBookings();
    } catch (err) {
      alert("Error confirming service");
    }
  };

  const handleReject = async () => {
    try {
      await API.put(`/bookings/${selectedBooking._id}/reject`, { notes });
      alert("Service Rejected ❌");
      setShowRejectModal(false);
      fetchBookings();
    } catch (err) {
      alert("Error rejecting service");
    }
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  return (
    <div className="container-fluid mt-4 mb-4">
      <h3>🩺 Nurse Dashboard</h3>

      {loading && <div className="alert alert-info">Loading...</div>}

      {/* Tabs */}
      <div className="nav nav-tabs mb-4">
        <button
          className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Care Requests ({pendingBookings.length})
        </button>

        <button
          className={`nav-link ${activeTab === "confirmed" ? "active" : ""}`}
          onClick={() => setActiveTab("confirmed")}
        >
          Accepted Visits ({confirmedBookings.length})
        </button>
      </div>

      {/* Pending */}
      {activeTab === "pending" && (
        <div className="row g-3">
          {pendingBookings.length === 0 ? (
            <div className="alert alert-info">
              No pending care requests.
            </div>
          ) : (
            pendingBookings.map((b) => (
              <div key={b._id} className="col-md-6 col-lg-4">
                <div className="card border-warning">
                  <div className="card-body">
                    <p><strong>Elder:</strong> {b.elderName}</p>
                    <p><strong>Service:</strong> {b.serviceType}</p>
                    <p><strong>Date:</strong> {formatDate(b.appointmentDate)}</p>

                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => openConfirmModal(b)}
                    >
                      Accept
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => openRejectModal(b)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirmed */}
      {activeTab === "confirmed" && (
        <div className="row g-3">
          {confirmedBookings.length === 0 ? (
            <div className="alert alert-info">
              No accepted visits yet.
            </div>
          ) : (
            confirmedBookings.map((b) => (
              <div key={b._id} className="col-md-6 col-lg-4">
                <div className="card border-success">
                  <div className="card-body">
                    <p><strong>Elder:</strong> {b.elderName}</p>
                    <p><strong>Status:</strong> Accepted</p>
                    <p><strong>Date:</strong> {formatDate(b.appointmentDate)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="pd-modal-backdrop">
          <div className="pd-modal">
            <h5>Accept Care Request</h5>
            <textarea
              className="form-control mb-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add care notes..."
            />
            <button className="btn btn-success me-2" onClick={handleConfirm}>
              Confirm
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="pd-modal-backdrop">
          <div className="pd-modal">
            <h5>Reject Care Request</h5>
            <textarea
              className="form-control mb-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason..."
            />
            <button className="btn btn-danger me-2" onClick={handleReject}>
              Reject
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowRejectModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NurseDashboard;