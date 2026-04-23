import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";
import "./DoctorDashboard.css";
import "./ProviderDashboard.css";
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

  // Patient history states
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientMedicines, setPatientMedicines] = useState([]);
  const [patientHealthData, setPatientHealthData] = useState([]);
  const [patientNotes, setPatientNotes] = useState([]);
  const [loadingPatientData, setLoadingPatientData] = useState(false);

  // Add medicine form state
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [medicineForm, setMedicineForm] = useState({
    medicineName: "",
    medicineType: "tablet",
    dosage: "",
    scheduleSlots: [],
    startDate: "",
    durationDays: "",
    currentStock: "",
    notes: "",
  });

  // Add health data form state
  const [showAddHealthData, setShowAddHealthData] = useState(false);
  const [healthForm, setHealthForm] = useState({
    bloodPressure: "",
    sugarLevel: "",
    notes: "",
  });

  // Add doctor note form state
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteForm, setNoteForm] = useState({
    note: "",
    noteType: "general",
    isVisibleToElder: true,
    isVisibleToFamily: true,
  });

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

      const waiting = pending.filter((b) => b.confirmationStatus === "Waiting");
      setPendingBookings(waiting);

      const allRes = await API.get("/bookings/all");
      const all = allRes.data.bookings || [];

      const doctorOnly = all.filter((b) => b.serviceType === "Doctor");
      setAllBookings(doctorOnly);

      // Extract unique patients from bookings
      const uniquePatients = [];
      const patientIds = new Set();
      doctorOnly.forEach((b) => {
        if (b.elder && !patientIds.has(b.elder.toString())) {
          patientIds.add(b.elder.toString());
          uniquePatients.push({
            _id: b.elder,
            name: b.elderName,
            email: b.elderEmail,
            phone: b.elderPhone,
            age: b.elderAge,
          });
        }
      });
      setPatients(uniquePatients);

      // Filter confirmed bookings from doctor bookings
      const confirmed = doctorOnly.filter(
        (b) => b.confirmationStatus === "Confirmed",
      );
      setConfirmedBookings(confirmed);
      // setAllBookings(all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientData = async (patient) => {
    try {
      setLoadingPatientData(true);
      setSelectedPatient(patient);

      // Fetch medicines for this patient
      const medicinesRes = await API.get(
        `/medicines/list?elderId=${patient._id}`,
      );
      setPatientMedicines(medicinesRes.data.medicines || []);

      // Fetch health data for this patient
      const healthRes = await API.get(`/health/list?elderId=${patient._id}`);
      setPatientHealthData(healthRes.data || []);

      // Fetch doctor notes for this patient
      const notesRes = await API.get(`/doctors/notes/${patient._id}`);
      setPatientNotes(notesRes.data.notes || []);
    } catch (err) {
      console.error("Error fetching patient data:", err);
      setPatientMedicines([]);
      setPatientHealthData([]);
      setPatientNotes([]);
    } finally {
      setLoadingPatientData(false);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      await API.post("/medicines", {
        ...medicineForm,
        elderId: selectedPatient._id,
      });
      alert("Medicine added successfully!");
      setShowAddMedicine(false);
      setMedicineForm({
        medicineName: "",
        medicineType: "tablet",
        dosage: "",
        scheduleSlots: [],
        startDate: "",
        durationDays: "",
        currentStock: "",
        notes: "",
      });
      fetchPatientData(selectedPatient);
    } catch (err) {
      alert("Error adding medicine");
    }
  };

  const handleAddHealthData = async (e) => {
    e.preventDefault();
    try {
      await API.post("/health/add", {
        ...healthForm,
        elderId: selectedPatient._id,
      });
      alert("Health data added successfully!");
      setShowAddHealthData(false);
      setHealthForm({
        bloodPressure: "",
        sugarLevel: "",
        notes: "",
      });
      fetchPatientData(selectedPatient);
    } catch (err) {
      alert("Error adding health data");
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await API.post("/doctors/notes", {
        elderId: selectedPatient._id,
        note: noteForm.note,
        noteType: noteForm.noteType,
        isVisibleToElder: noteForm.isVisibleToElder,
        isVisibleToFamily: noteForm.isVisibleToFamily,
      });
      alert("Note added successfully!");
      setShowAddNote(false);
      setNoteForm({
        note: "",
        noteType: "general",
        isVisibleToElder: true,
        isVisibleToFamily: true,
      });
      fetchPatientData(selectedPatient);
    } catch (err) {
      alert("Error adding note");
    }
  };

  const handleSlotChange = (slot) => {
    setMedicineForm((prev) => {
      const slots = prev.scheduleSlots.includes(slot)
        ? prev.scheduleSlots.filter((s) => s !== slot)
        : [...prev.scheduleSlots, slot];
      return { ...prev, scheduleSlots: slots };
    });
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

        <button
          className={`nav-link ${activeTab === "patients" ? "active" : ""}`}
          onClick={() => setActiveTab("patients")}
        >
          Patients ({patients.length})
        </button>

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
                <p>
                  <b>Patient:</b> {b.elderName}
                </p>
                <p>
                  <b>Service:</b> {b.serviceType}
                </p>
                <p>
                  <b>Date:</b> {b.appointmentDate}
                </p>

                <button onClick={() => openConfirmModal(b)}>Accept</button>
                <button onClick={() => openRejectModal(b)}>Reject</button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirmed */}
      {activeTab === "confirmed" && (
        <div>
          {confirmedBookings.length === 0 ? (
            <p>No confirmed bookings</p>
          ) : (
            confirmedBookings.map((b) => (
              <div key={b._id} className="card card-confirmed p-3 mb-2">
                <p>
                  <b>Patient:</b> {b.elderName}
                </p>
                <p>
                  <b>Service:</b> {b.serviceType}
                </p>
                <p>
                  <b>Date:</b> {b.appointmentDate}
                </p>
                <p>
                  <b>Status:</b>{" "}
                  <span style={{ color: "#28a745", fontWeight: "700" }}>
                    ✓ Confirmed
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Profile */}
      {activeTab === "profile" && <DoctorProfile />}
      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="modal">
          <div className="modal-content">
            <h5>Confirm Booking</h5>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
            />
            <div className="modal-buttons">
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal">
          <div className="modal-content">
            <h5>Reject Booking</h5>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add reason for rejection..."
            />
            <div className="modal-buttons">
              <button onClick={handleReject}>Reject</button>
              <button onClick={() => setShowRejectModal(false)}>Cancel</button>
            </div>
          </div>
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
                    <span
                      className={`badge ${
                        b.status === "Confirmed"
                          ? "bg-success"
                          : b.status === "Cancelled"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        b.confirmationStatus === "Confirmed"
                          ? "bg-success"
                          : b.confirmationStatus === "Rejected"
                            ? "bg-danger"
                            : "bg-secondary"
                      }`}
                    >
                      {b.confirmationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Patients Tab */}
      {activeTab === "patients" && (
        <div>
          {patients.length === 0 ? (
            <p>No patients yet</p>
          ) : (
            <div className="row">
              {/* Patient List */}
              <div className="col-md-4">
                <h5>Select Patient</h5>
                <div className="list-group">
                  {patients.map((patient) => (
                    <button
                      key={patient._id}
                      className={`list-group-item list-group-item-action ${
                        selectedPatient?._id === patient._id ? "active" : ""
                      }`}
                      onClick={() => fetchPatientData(patient)}
                    >
                      {patient.name}
                      {patient.age && ` (${patient.age} yrs)`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Details */}
              <div className="col-md-8">
                {selectedPatient ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Patient: {selectedPatient.name}</h5>
                      <div>
                        {/* <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => setShowAddMedicine(true)}
                        >
                          + Medicine
                        </button> */}
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => setShowAddHealthData(true)}
                        >
                          + Vitals
                        </button>
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => setShowAddNote(true)}
                        >
                          + Note
                        </button>
                      </div>
                    </div>

                    {loadingPatientData ? (
                      <p>Loading patient data...</p>
                    ) : (
                      <div>
                        {/* Medicines Section */}
                        <div className="card mb-3">
                          <div className="card-header bg-primary text-white">
                            💊 Current Medicines ({patientMedicines.length})
                          </div>
                          <div className="card-body">
                            {patientMedicines.length === 0 ? (
                              <p className="text-muted">No medicines found</p>
                            ) : (
                              <ul className="list-group">
                                {patientMedicines.map((med) => (
                                  <li
                                    key={med._id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                  >
                                    <div>
                                      <strong>{med.medicineName}</strong>
                                      <br />
                                      <small>
                                        {med.dosage} -{" "}
                                        {med.scheduleSlots?.join(", ")}
                                      </small>
                                    </div>
                                    <span
                                      className={`badge ${
                                        med.status === "active"
                                          ? "bg-success"
                                          : "bg-secondary"
                                      }`}
                                    >
                                      {med.status}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>

                        {/* Health Data Section */}
                        <div className="card mb-3">
                          <div className="card-header bg-success text-white">
                            ❤️ Health Records ({patientHealthData.length})
                          </div>
                          <div className="card-body">
                            {patientHealthData.length === 0 ? (
                              <p className="text-muted">
                                No health records found
                              </p>
                            ) : (
                              <div className="table-responsive">
                                <table className="table table-sm">
                                  <thead>
                                    <tr>
                                      <th>Date</th>
                                      <th>BP</th>
                                      <th>Sugar</th>
                                      <th>Notes</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {patientHealthData.map((health) => (
                                      <tr key={health._id}>
                                        <td>
                                          {new Date(
                                            health.createdAt,
                                          ).toLocaleDateString()}
                                        </td>
                                        <td>{health.bloodPressure}</td>
                                        <td>{health.sugarLevel}</td>
                                        <td>{health.notes || "-"}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Doctor Notes Section */}
                        <div className="card mb-3">
                          <div className="card-header bg-info text-white">
                            📝 Doctor Notes ({patientNotes.length})
                          </div>
                          <div className="card-body">
                            {patientNotes.length === 0 ? (
                              <p className="text-muted">No notes yet</p>
                            ) : (
                              <div className="list-group">
                                {patientNotes.map((note) => (
                                  <div
                                    key={note._id}
                                    className="list-group-item"
                                  >
                                    <div className="d-flex justify-content-between">
                                      <strong>
                                        {note.noteType === "prescription"
                                          ? "💊 Prescription"
                                          : note.noteType === "followup"
                                            ? "📅 Follow-up"
                                            : note.noteType === "warning"
                                              ? "⚠️ Warning"
                                              : note.noteType === "suggestion"
                                                ? "💡 Suggestion"
                                                : "📝 Note"}
                                      </strong>
                                      <small>
                                        {new Date(
                                          note.createdAt,
                                        ).toLocaleDateString()}
                                      </small>
                                    </div>
                                    <p className="mb-1 mt-2">{note.note}</p>
                                    <small className="text-muted">
                                      By: {note.doctor?.name || "Doctor"}
                                    </small>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted">Select a patient to view details</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Medicine Modal */}
      {showAddMedicine && (
        <div className="modal">
          <div className="modal-content">
            <h5>Add Medicine for {selectedPatient?.name}</h5>
            <form onSubmit={handleAddMedicine}>
              <div className="mb-2">
                <label>Medicine Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={medicineForm.medicineName}
                  onChange={(e) =>
                    setMedicineForm({
                      ...medicineForm,
                      medicineName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-2">
                <label>Type</label>
                <select
                  className="form-control"
                  value={medicineForm.medicineType}
                  onChange={(e) =>
                    setMedicineForm({
                      ...medicineForm,
                      medicineType: e.target.value,
                    })
                  }
                >
                  <option value="tablet">Tablet</option>
                  <option value="capsule">Capsule</option>
                  <option value="injection">Injection</option>
                </select>
              </div>
              <div className="mb-2">
                <label>Dosage</label>
                <input
                  type="text"
                  className="form-control"
                  value={medicineForm.dosage}
                  onChange={(e) =>
                    setMedicineForm({
                      ...medicineForm,
                      dosage: e.target.value,
                    })
                  }
                  placeholder="e.g., 1 tablet"
                  required
                />
              </div>
              <div className="mb-2">
                <label>Schedule Slots</label>
                <div>
                  {["Morning", "Afternoon", "Night"].map((slot) => (
                    <label key={slot} className="me-3">
                      <input
                        type="checkbox"
                        checked={medicineForm.scheduleSlots.includes(slot)}
                        onChange={() => handleSlotChange(slot)}
                      />{" "}
                      {slot}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <label>Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={medicineForm.startDate}
                  onChange={(e) =>
                    setMedicineForm({
                      ...medicineForm,
                      startDate: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-2">
                <label>Duration (days)</label>
                <input
                  type="number"
                  className="form-control"
                  value={medicineForm.durationDays}
                  onChange={(e) =>
                    setMedicineForm({
                      ...medicineForm,
                      durationDays: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-2">
                <label>Current Stock</label>
                <input
                  type="number"
                  className="form-control"
                  value={medicineForm.currentStock}
                  onChange={(e) =>
                    setMedicineForm({
                      ...medicineForm,
                      currentStock: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-2">
                <label>Notes</label>
                <textarea
                  className="form-control"
                  value={medicineForm.notes}
                  onChange={(e) =>
                    setMedicineForm({
                      ...medicineForm,
                      notes: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">
                  Add Medicine
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddMedicine(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Health Data Modal */}
      {showAddHealthData && (
        <div className="modal">
          <div className="modal-content">
            <h5>Add Health Data for {selectedPatient?.name}</h5>
            <form onSubmit={handleAddHealthData}>
              <div className="mb-2">
                <label>Blood Pressure</label>
                <input
                  type="text"
                  className="form-control"
                  value={healthForm.bloodPressure}
                  onChange={(e) =>
                    setHealthForm({
                      ...healthForm,
                      bloodPressure: e.target.value,
                    })
                  }
                  placeholder="e.g., 120/80"
                  required
                />
              </div>
              <div className="mb-2">
                <label>Sugar Level</label>
                <input
                  type="text"
                  className="form-control"
                  value={healthForm.sugarLevel}
                  onChange={(e) =>
                    setHealthForm({
                      ...healthForm,
                      sugarLevel: e.target.value,
                    })
                  }
                  placeholder="e.g., 100 mg/dL"
                  required
                />
              </div>
              <div className="mb-2">
                <label>Notes</label>
                <textarea
                  className="form-control"
                  value={healthForm.notes}
                  onChange={(e) =>
                    setHealthForm({
                      ...healthForm,
                      notes: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-success">
                  Add Health Data
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddHealthData(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddNote && (
        <div className="modal">
          <div className="modal-content">
            <h5>Add Note for {selectedPatient?.name}</h5>
            <form onSubmit={handleAddNote}>
              <div className="mb-2">
                <label>Note Type</label>
                <select
                  className="form-control"
                  value={noteForm.noteType}
                  onChange={(e) =>
                    setNoteForm({
                      ...noteForm,
                      noteType: e.target.value,
                    })
                  }
                >
                  <option value="general">General</option>
                  <option value="prescription">Prescription</option>
                  <option value="followup">Follow-up</option>
                  <option value="warning">Warning</option>
                  <option value="suggestion">Suggestion</option>
                </select>
              </div>
              <div className="mb-2">
                <label>Note</label>
                <textarea
                  className="form-control"
                  value={noteForm.note}
                  onChange={(e) =>
                    setNoteForm({
                      ...noteForm,
                      note: e.target.value,
                    })
                  }
                  placeholder="Enter your note or suggestion..."
                  required
                />
              </div>
              <div className="mb-2">
                <label>
                  <input
                    type="checkbox"
                    checked={noteForm.isVisibleToElder}
                    onChange={(e) =>
                      setNoteForm({
                        ...noteForm,
                        isVisibleToElder: e.target.checked,
                      })
                    }
                  />{" "}
                  Visible to Elder
                </label>
              </div>
              <div className="mb-2">
                <label>
                  <input
                    type="checkbox"
                    checked={noteForm.isVisibleToFamily}
                    onChange={(e) =>
                      setNoteForm({
                        ...noteForm,
                        isVisibleToFamily: e.target.checked,
                      })
                    }
                  />{" "}
                  Visible to Family
                </label>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-info">
                  Add Note
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddNote(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
