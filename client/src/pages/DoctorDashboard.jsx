import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";
import "./DoctorDashboard.css";
import DoctorProfile from "./DoctorProfile";


function DoctorDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
  const [pendingBookings, setPendingBookings] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [notes, setNotes] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [allBookings, setAllBookings] = useState([]);

  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      // Pending bookings (doctor specific)
      const pendingRes = await API.get("/bookings/pending");
      const pending = pendingRes.data.bookings || [];

      const waiting = pending.filter(
        (b) => b.confirmationStatus === "Waiting"
      );
      setPendingBookings(waiting);

    const allRes = await API.get("/bookings/all");
    const all = allRes.data.bookings || [];

    const doctorOnly = all.filter((b) => b.serviceType === "Doctor");
    setAllBookings(doctorOnly);
    // setAllBookings(all);

    } catch (err) {
      console.error(err);
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
      alert("Booking Accepted ✅");
      setShowConfirmModal(false);
      fetchBookings();
    } catch (err) {
      alert("Error confirming booking");
    }
  };

  const handleReject = async () => {
    try {
      await API.put(`/bookings/${selectedBooking._id}/reject`, { notes });
      alert("Booking Rejected ❌");
      setShowRejectModal(false);
      fetchBookings();
    } catch (err) {
      alert("Error rejecting booking");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
  <h3>🩺 Dr. {user?.name}</h3>
</div>

      {loading && <p>Loading...</p>}

      {/* Tabs */}
      <div className="nav nav-tabs mb-4">

  <button
    className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
    onClick={() => setActiveTab("pending")}
  >
    Pending ({pendingBookings.length})
  </button>

  <button
    className={`nav-link ${activeTab === "confirmed" ? "active" : ""}`}
    onClick={() => setActiveTab("confirmed")}
  >
    Confirmed ({confirmedBookings.length})
  </button>

  <button
    className={`nav-link ${activeTab === "all" ? "active" : ""}`}
    onClick={() => setActiveTab("all")}
  >
    All Bookings ({allBookings.length})
  </button>
  {/* <button className="btn btn-outline-primary" onClick={() => navigate("/doctor-profile")}
>
  View Profile
</button> */}
<button
    className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
    onClick={() => setActiveTab("profile")}
  >
    Profile
  </button>

</div>

      {/* Pending */}
      {activeTab === "pending" && (
        <div>
          {pendingBookings.length === 0 ? (
            <p>No pending requests</p>
          ) : (
            pendingBookings.map((b) => (
              <div key={b._id} className="card p-3 mb-2">
                <p><b>Patient:</b> {b.elderName}</p>
                <p><b>Service:</b> {b.serviceType}</p>
                <p><b>Date:</b> {b.appointmentDate}</p>

                <button onClick={() => openConfirmModal(b)}>
                  Accept
                </button>
                <button onClick={() => openRejectModal(b)}>
                  Reject
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirmed */}
      {activeTab === "confirmed" && (
        <div>
          {confirmedBookings.map((b) => (
            <div key={b._id} className="card p-3 mb-2">
              <p><b>Patient:</b> {b.elderName}</p>
              <p><b>Status:</b> Confirmed</p>
            </div>
          ))}
        </div>
      )}

{/* Profile */}
{activeTab === "profile" && (
  <DoctorProfile />
)}
      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="modal">
          <h5>Confirm Booking</h5>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes..."
          />
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal">
          <h5>Reject Booking</h5>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button onClick={handleReject}>Reject</button>
          <button onClick={() => setShowRejectModal(false)}>Cancel</button>
        </div>
      )}

      {activeTab === "all" && (
  <div className="table-responsive">
    <table className="table table-bordered table-striped">
      <thead className="table-dark">
        <tr>
          <th>#</th>
          <th>Elder</th>
          <th>Service</th>
          <th>Date</th>
          <th>Status</th>
          <th>Confirmation</th>
        </tr>
      </thead>
      <tbody>
        {allBookings.map((b, index) => (
          <tr key={b._id}>
            <td>{index + 1}</td>
            <td>{b.elderName}</td>
            <td>{b.serviceType}</td>
            <td>{new Date(b.appointmentDate).toLocaleDateString()}</td>

            <td>
              <span className={`badge ${
                b.status === "Confirmed"
                  ? "bg-success"
                  : b.status === "Cancelled"
                  ? "bg-danger"
                  : "bg-warning text-dark"
              }`}>
                {b.status}
              </span>
            </td>

            <td>
              <span className={`badge ${
                b.confirmationStatus === "Confirmed"
                  ? "bg-success"
                  : b.confirmationStatus === "Rejected"
                  ? "bg-danger"
                  : "bg-secondary"
              }`}>
                {b.confirmationStatus}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
    </div>
  );
}

export default DoctorDashboard;