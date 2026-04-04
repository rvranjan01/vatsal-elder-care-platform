import React, { useEffect, useState } from "react";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FamilyDashboard.css";
import { Link } from "react-router-dom";

function FamilyDashboard() {
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [games, setGames] = useState([]);
  const [yogaActivities, setYogaActivities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [elders, setElders] = useState([]);
  const [selectedElder, setSelectedElder] = useState(null);
  const [showCompanionModal, setShowCompanionModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    appointmentDate: "",
    timeSlot: "",
    notes: "",
    providerId: "",
  });
  const [providers, setProviders] = useState({ companion: [], event: [] });
  const [showProviderList, setShowProviderList] = useState(false);
  //Add state for new elder form
  const [showAddElderModal, setShowAddElderModal] = useState(false);
  const [newElderForm, setNewElderForm] = useState({
    username: "",
    relation: "",
  });

  useEffect(() => {
    fetchProfileAndData();
  }, []);

  const fetchProfileAndData = async () => {
    try {
      setLoading(true);

      // 1. DEBUG: Check token first
      const token = localStorage.getItem("token");
      console.log("🔑 TOKEN:", token ? "EXISTS" : "MISSING");

      // 2. Get user profile
      console.log("👤 Fetching /auth/me...");
      const me = await API.get("/auth/me");
      const user = me.data.user;
      console.log("✅ User profile:", user);

      const linked = user.elderIds || [];
      console.log("👴 Linked elders:", linked);

      setElders(linked);
      if (linked.length > 0) {
        const firstElderId = linked[0]._id || linked[0];
        console.log("🎯 First elder ID:", firstElderId);
        setSelectedElder(firstElderId);

        console.log("📊 Fetching data for elder:", firstElderId);
        await fetchAllData(firstElderId);
      }
    } catch (err) {
      console.error("❌ Profile error:", {
        status: err.response?.status,
        message: err.response?.data,
        url: err.config?.url,
      });
      setLoading(false);
    }
  };

  const fetchAllData = async (elderId) => {
    try {
      setLoading(true);
      const healthReq = API.get(
        `/health/list${elderId ? `?elderId=${elderId}` : ""}`,
      );
      const bookingReq = API.get(
        `/bookings/my-bookings${elderId ? `?elderId=${elderId}` : ""}`,
      );
      const [hRes, mRes, gRes, yRes, bRes] = await Promise.all([
        healthReq,
        API.get("/medicines/list"),
        API.get("/games/list"),
        API.get("/yoga/list"),
        bookingReq,
      ]);

      setHealthData(hRes.data || []);
      setMedicines(mRes.data || []);
      setGames(gRes.data || []);
      setYogaActivities(yRes.data || []);
      setBookings((bRes.data && bRes.data.bookings) || []);
    } catch (err) {
      console.error("Error loading family dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "-";
    }
  };

  const downloadReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      healthData,
      medicines,
      games,
      yogaActivities,
      bookings,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elder-full-report-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleElderChange = async (e) => {
    const val = e.target.value;
    setSelectedElder(val);
    await fetchAllData(val);
  };

  const openCompanionModal = async () => {
    setBookingForm({
      appointmentDate: "",
      timeSlot: "",
      notes: "",
      providerId: "",
    });
    setShowCompanionModal(true);
    try {
      const res = await API.get("/admin/providers/browse?role=companion");
      setProviders((prev) => ({ ...prev, companion: res.data.active || [] }));
    } catch (err) {
      console.error("Error fetching companions:", err);
    }
  };

  const openEventModal = () => {
    setBookingForm({
      appointmentDate: "",
      timeSlot: "",
      notes: "",
      providerId: "",
    });
    setShowEventModal(true);
  };

  const submitBooking = async (serviceType) => {
    try {
      const payload = {
        elderId: selectedElder,
        serviceType,
        appointmentDate: bookingForm.appointmentDate,
        timeSlot: bookingForm.timeSlot,
        notes: bookingForm.notes,
        reason: bookingForm.notes,
      };
      const res = await API.post("/bookings/create", payload);
      // refresh data for selected elder
      await fetchAllData(selectedElder);
      setShowCompanionModal(false);
      setShowEventModal(false);
    } catch (err) {
      console.error("Error creating booking", err);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  if (loading)
    return <div className="text-center p-5">Loading family dashboard...</div>;

  return (
    <div className="family-dashboard container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Family Dashboard</h2>
          <p className="text-muted mb-0">
            View the elder's full activity & health report
          </p>
        </div>
        <div>
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => fetchAllData(selectedElder)}
          >
            Refresh
          </button>
          <button className="btn btn-primary" onClick={downloadReport}>
            Download Full Report
          </button>
        </div>
      </div>

      <div className="row gy-3 mb-3 align-items-center">
        <div className="col-md-6">
          <div className="d-flex gap-2 align-items-center">
            <label className="mb-0 me-2">
              <strong>Select Elder:</strong>
            </label>
            {elders.length === 0 ? (
              <p className="text-warning mb-0">
                No linked elders found. Please ensure you registered with a
                valid elder username.
              </p>
            ) : (
              <select
                className="form-select form-select-sm w-auto"
                value={selectedElder || ""}
                onChange={handleElderChange}
              >
                <option value="">-- Choose Elder --</option>
                {elders.map((e) => {
                  const id = e._id || e.id;
                  const name = e.name || e.username || "Unknown Elder";
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        </div>

        <div className="col-md-6 text-md-end">
          <button
            className="btn btn-sm btn-outline-success me-2"
            onClick={openCompanionModal}
          >
            Book Companion
          </button>
          <button
            className="btn btn-sm btn-outline-info me-2"
            onClick={openEventModal}
          >
            Create Event
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => downloadReport()}
          >
            Download Full Report
          </button>
        </div>
      </div>

      <div className="row gy-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Health History</h5>
              {healthData.length === 0 ? (
                <p className="text-muted">
                  No health records available for the linked elder.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-striped">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Blood Pressure</th>
                        <th>Blood Sugar</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthData.map((h, idx) => (
                        <tr key={idx}>
                          <td>{formatDate(h.createdAt || h.date)}</td>
                          <td>{h.bloodPressure || "-"}</td>
                          <td>{h.sugarLevel || "-"}</td>
                          <td>{h.notes || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Medicine Schedule</h5>
              {medicines.length === 0 ? (
                <p className="text-muted">No medicines recorded.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {medicines.map((m, i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <div className="fw-bold">
                          {m.medicineName || "Medicine"}
                        </div>
                        <div className="text-muted small">
                          {m.dosage || "Dosage not specified"}
                        </div>
                      </div>
                      <div className="text-end small">{m.schedule || "--"}</div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3">
                <Link to="/health" className="btn btn-sm btn-outline-secondary">
                  Open Health Module
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Appointments & Bookings</h5>
              {bookings.length === 0 ? (
                <p className="text-muted">No bookings found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b, i) => (
                        <tr key={i}>
                          <td>{b.service || b.type || "Appointment"}</td>
                          <td>{formatDate(b.appointmentDate || b.date)}</td>
                          <td>{b.status || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-3">
                <Link
                  to="/booking"
                  className="btn btn-sm btn-outline-secondary"
                >
                  Manage Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Mind Games / Activities</h5>
              {games.length === 0 ? (
                <p className="text-muted">No game activity recorded.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {games.map((g, i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-bold">{g.gameName || "Game"}</div>
                        <div className="small text-muted">
                          Score: {g.score ?? "-"}
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline-primary">
                        Open
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Yoga & Exercises</h5>
              {yogaActivities.length === 0 ? (
                <p className="text-muted">No yoga activity recorded.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {yogaActivities.map((y, i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <div className="fw-bold">{y.title || "Session"}</div>
                        <div className="small text-muted">
                          {y.duration || "--"} • {y.benefits || "--"}
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-success">
                          {y.level || "Beginner"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Companion Modal */}
      {showCompanionModal && (
        <div className="fd-modal-backdrop">
          <div className="fd-modal-card">
            <h5>Book Companion</h5>

            {!bookingForm.providerId ? (
              <>
                <p className="small text-muted mb-3">
                  Select a companion first:
                </p>
                <div className="fd-provider-list mb-3">
                  {providers.companion.length === 0 ? (
                    <p className="text-muted">No companions available</p>
                  ) : (
                    providers.companion.map((p) => (
                      <div
                        key={p._id}
                        className="fd-provider-item"
                        onClick={() =>
                          setBookingForm((prev) => ({
                            ...prev,
                            providerId: p._id,
                          }))
                        }
                      >
                        <div className="fw-bold">{p.name}</div>
                        <div className="small text-muted">{p.email}</div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="alert alert-info small mb-3">
                  Selected:{" "}
                  <strong>
                    {
                      providers.companion.find(
                        (p) => p._id === bookingForm.providerId,
                      )?.name
                    }
                  </strong>
                  <button
                    className="btn btn-link btn-sm float-end"
                    onClick={() =>
                      setBookingForm((prev) => ({ ...prev, providerId: "" }))
                    }
                  >
                    Change
                  </button>
                </div>

                <div className="mb-2">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bookingForm.appointmentDate}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        appointmentDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Time Slot</label>
                  <input
                    type="time"
                    className="form-control"
                    value={bookingForm.timeSlot}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        timeSlot: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={bookingForm.notes}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  ></textarea>
                </div>
              </>
            )}

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowCompanionModal(false)}
              >
                Cancel
              </button>
              {bookingForm.providerId && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => submitBooking("Companion")}
                >
                  Confirm Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fd-modal-backdrop">
          <div className="fd-modal-card">
            <h5>Create Event</h5>
            <div className="mb-2">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={bookingForm.appointmentDate}
                onChange={(e) =>
                  setBookingForm((prev) => ({
                    ...prev,
                    appointmentDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Notes / Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={bookingForm.notes}
                onChange={(e) =>
                  setBookingForm((prev) => ({ ...prev, notes: e.target.value }))
                }
              ></textarea>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowEventModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-info btn-sm"
                onClick={() => submitBooking("Event")}
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FamilyDashboard;
