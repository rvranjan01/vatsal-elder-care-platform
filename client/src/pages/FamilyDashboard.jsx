import React, { useEffect, useState } from "react";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FamilyDashboard.css";
import { Link } from "react-router-dom";
import StatsCard from "../components/StatsCard";
import ActivityTracker from "../components/ActivityTracker";
import ProviderSection from "../components/ProviderSection";

function FamilyDashboard() {
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [games, setGames] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [yogaActivities, setYogaActivities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [elders, setElders] = useState([]);
  const [selectedElder, setSelectedElder] = useState(null);
  const [selectedElderDetails, setSelectedElderDetails] = useState(null);
  const [familyEvents, setFamilyEvents] = useState([]);
  const [providers, setProviders] = useState({
    companion: [],
    doctor: [],
    nurse: [],
  });
  const [providerLoading, setProviderLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    gamesPlayed: 0,
    totalGameScore: 0,
    platformMinutes: 0,
    dailyAverage: 0,
    eventCount: 0,
  });
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    type: "wellness",
  });

  // Modals & Forms
  const [showCompanionModal, setShowCompanionModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showNurseModal, setShowNurseModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAddElderModal, setShowAddElderModal] = useState(false);
  const [showCareNoteModal, setShowCareNoteModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Booking Form
  const [bookingForm, setBookingForm] = useState({
    appointmentDate: "",
    timeSlot: "",
    consultationType: "In-person",
    notes: "",
    providerId: "",
  });

  // Additional Data
  const [careNotes, setCareNotes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [familyMessages, setFamilyMessages] = useState([]);

  // Form States
  const [newElderForm, setNewElderForm] = useState({
    username: "",
  });
  const [careNoteForm, setCareNoteForm] = useState({
    title: "",
    content: "",
    category: "General",
    priority: "Low",
  });
  const [documentForm, setDocumentForm] = useState({
    fileName: "",
    documentType: "Other",
    description: "",
  });
  const [messageForm, setMessageForm] = useState({
    message: "",
    messageType: "Note",
  });

  // UI States
  const [addingElder, setAddingElder] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [savingMessage, setSavingMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  

  useEffect(() => {
    fetchProfileAndData();
    fetchProviders();
    fetchFamilyEvents();
  }, []);

  const fetchProfileAndData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      console.log("🔑 TOKEN:", token ? "EXISTS" : "MISSING");

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

  const fetchProviders = async () => {
    setProviderLoading(true);
    try {
      const [companionRes, doctorRes, nurseRes] = await Promise.all([
        API.get("/companions"),
        API.get("/doctors"),
        API.get("/nurses"),
      ]);

      setProviders({
        companion: companionRes.data.companions || [],
        doctor: doctorRes.data.doctors || [],
        nurse: nurseRes.data.nurses || [],
      });
    } catch (err) {
      console.error("Error fetching providers:", err);
      setProviders({ companion: [], doctor: [], nurse: [] });
    } finally {
      setProviderLoading(false);
    }
  };

  const fetchFamilyEvents = async () => {
    try {
      const res = await API.get("/local-events");
      const events = res.data.events || [];
      setFamilyEvents(events);
      setDashboardStats((prev) => ({ ...prev, eventCount: events.length }));
    } catch (err) {
      console.error("Error fetching family events:", err);
      setFamilyEvents([]);
      setDashboardStats((prev) => ({ ...prev, eventCount: 0 }));
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
      const careNotesReq = API.get(`/family/care-notes/${elderId}`).catch(
        () => ({ data: [] }),
      );
      const documentsReq = API.get(`/family/documents/${elderId}`).catch(
        () => ({ data: [] }),
      );
      const activityReq = API.get(`/family/activity-log/${elderId}`).catch(
        () => ({ data: [] }),
      );
      const messagesReq = API.get(`/family/messages/${elderId}`).catch(() => ({
        data: [],
      }));
      const elderDetailsReq = API.get(`/family/elder-details/${elderId}`).catch(
        () => ({ data: {} }),
      );
      const gameHistoryReq = API.get(
        `/games/list${elderId ? `?elderId=${elderId}` : ""}`,
      );

      const [
        hRes,
        mRes,
        ghRes,
        yRes,
        bRes,
        notesRes,
        docsRes,
        actRes,
        msgRes,
        elderRes,
      ] = await Promise.all([
        healthReq,
        API.get(`/medicines/list${elderId ? `?elderId=${elderId}` : ""}`),
        gameHistoryReq,
        API.get(`/yoga/list${elderId ? `?elderId=${elderId}` : ""}`),
        bookingReq,
        careNotesReq,
        documentsReq,
        activityReq,
        messagesReq,
        elderDetailsReq,
      ]);

      const activities = actRes.data || [];
      const history = ghRes.data || [];

      setHealthData(hRes.data || []);
      setMedicines(mRes.data?.medicines || mRes.data || []);
      setGames(history);
      setGameHistory(history);
      setYogaActivities(yRes.data || []);
      setBookings((bRes.data && bRes.data.bookings) || []);
      setCareNotes(notesRes.data || []);
      setDocuments(docsRes.data || []);
      setActivityLog(activities);
      setFamilyMessages(msgRes.data || []);
      setSelectedElderDetails(elderRes.data?.elder || null);
      setDashboardStats(
        calculateDashboardStats(
          history,
          activities,
          (bRes.data && bRes.data.bookings) || [],
          familyEvents.length,
        ),
      );
    } catch (err) {
      console.error("Error loading family dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDashboardStats = (
    history,
    activities,
    bookings,
    eventCount = 0,
  ) => {
    const gamesPlayed = history.length;
    const totalGameScore = history.reduce(
      (sum, item) => sum + (item.score || 0),
      0,
    );
    const gameMinutes = history.reduce(
      (sum, item) => sum + (item.durationMinutes || 15),
      0,
    );
    const activityMinutes = activities.reduce(
      (sum, item) => sum + (item.details?.durationMinutes || 10),
      0,
    );
    const platformMinutes = gameMinutes + activityMinutes;
    const days = new Set(
      activities.map((item) => new Date(item.createdAt).toDateString()),
    ).size;
    const dailyAverage = days > 0 ? Math.round(platformMinutes / days) : 0;

    return {
      gamesPlayed,
      totalGameScore,
      platformMinutes,
      dailyAverage,
      eventCount,
    };
  };

  const buildActivityTimeline = (history, activities) => {
    const historyItems = history.map((item) => ({
      title: `Game played: ${item.gameName || item.gameId}`,
      details: `Score ${item.score || 0}`,
      value: `${item.durationMinutes || 15} min`,
      time: new Date(item.playedAt || item.createdAt).toLocaleString(),
      createdAt: new Date(item.playedAt || item.createdAt),
    }));

    const activityItems = activities.map((item) => ({
      title: item.activityType || "Activity",
      details: item.description || "No details provided",
      value: `${item.details?.durationMinutes || 10} min`,
      time: new Date(item.createdAt).toLocaleString(),
      createdAt: new Date(item.createdAt),
    }));

    return [...historyItems, ...activityItems]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 8);
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "-";
    }
  };

  const handleAddElder = async () => {
    try {
      if (!newElderForm.username.trim()) {
        alert("Please enter elder username");
        return;
      }

      setAddingElder(true);
      const res = await API.post("/family/link-elder", {
        elderUsername: newElderForm.username,
      });

      setAlertMessage({
        type: "success",
        text: "Elder linked successfully!",
      });
      setNewElderForm({ username: "" });
      setShowAddElderModal(false);

      // Refresh profile and data
      await fetchProfileAndData();

      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      setAlertMessage({
        type: "danger",
        text:
          err.response?.data?.message ||
          "Failed to link elder. Please check the username.",
      });
    } finally {
      setAddingElder(false);
    }
  };

  const handleSaveCareNote = async () => {
    try {
      if (!careNoteForm.title.trim() || !careNoteForm.content.trim()) {
        alert("Please fill in all fields");
        return;
      }

      setSavingNote(true);
      const res = await API.post("/family/care-notes", {
        elderId: selectedElder,
        title: careNoteForm.title,
        content: careNoteForm.content,
        category: careNoteForm.category,
        priority: careNoteForm.priority,
      });

      setCareNotes([res.data, ...careNotes]);
      setAlertMessage({ type: "success", text: "Care note saved!" });
      setCareNoteForm({
        title: "",
        content: "",
        category: "General",
        priority: "Low",
      });
      setShowCareNoteModal(false);

      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      setAlertMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to save care note",
      });
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteCareNote = async (noteId) => {
    if (!window.confirm("Delete this care note?")) return;

    try {
      await API.delete(`/family/care-notes/${noteId}`);
      setCareNotes(careNotes.filter((n) => n._id !== noteId));
      setAlertMessage({ type: "success", text: "Care note deleted!" });
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      setAlertMessage({
        type: "danger",
        text: "Failed to delete care note",
      });
    }
  };

  const handleUploadDocument = async () => {
    try {
      if (!documentForm.fileName.trim()) {
        alert("Please enter document name");
        return;
      }

      const res = await API.post("/family/documents/upload", {
        elderId: selectedElder,
        fileName: documentForm.fileName,
        documentType: documentForm.documentType,
        description: documentForm.description,
      });

      setDocuments([res.data, ...documents]);
      setAlertMessage({ type: "success", text: "Document uploaded!" });
      setDocumentForm({
        fileName: "",
        documentType: "Other",
        description: "",
      });
      setShowDocumentModal(false);

      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      setAlertMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to upload document",
      });
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await API.delete(`/family/documents/${docId}`);
      setDocuments(documents.filter((d) => d._id !== docId));
      setAlertMessage({ type: "success", text: "Document deleted!" });
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      setAlertMessage({
        type: "danger",
        text: "Failed to delete document",
      });
    }
  };

  const handleSendMessage = async () => {
    try {
      if (!messageForm.message.trim()) {
        alert("Please enter a message");
        return;
      }

      setSavingMessage(true);
      const res = await API.post("/family/messages", {
        elderId: selectedElder,
        message: messageForm.message,
        messageType: messageForm.messageType,
      });

      setFamilyMessages([res.data, ...familyMessages]);
      setAlertMessage({ type: "success", text: "Message sent!" });
      setMessageForm({ message: "", messageType: "Note" });
      setShowMessageModal(false);

      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      setAlertMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to send message",
      });
    } finally {
      setSavingMessage(false);
    }
  };

  // Check for health alerts (abnormal readings)
  const getHealthAlerts = () => {
    return healthData.filter((h) => {
      const bp = h.bloodPressure;
      const sugar = h.sugarLevel;

      // Simple alerts - you can customize these thresholds
      if (bp && (bp.includes("140") || bp.includes("15"))) return true;
      if (sugar && parseInt(sugar) > 200) return true;
      return false;
    });
  };

  const downloadReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      elderDetails: selectedElderDetails,
      healthData,
      medicines,
      games,
      yogaActivities,
      bookings,
      careNotes,
      documents: documents.length,
      messages: familyMessages.length,
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
      setProviders((prev) => ({
        ...prev,
        companion: res.data.providers || [],
      }));
    } catch (err) {
      console.error("Error fetching companions:", err);
    }
  };

  const openDoctorModal = async () => {
    setBookingForm({
      appointmentDate: "",
      timeSlot: "09:00 AM",
      consultationType: "In-person",
      notes: "",
      providerId: "",
    });
    setShowDoctorModal(true);
    try {
      const res = await API.get("/doctors");
      setProviders((prev) => ({ ...prev, doctor: res.data.doctors || [] }));
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const openNurseModal = async () => {
    setBookingForm({
      appointmentDate: "",
      timeSlot: "",
      notes: "",
      providerId: "",
    });
    setShowNurseModal(true);
    try {
      const res = await API.get("/nurses");
      setProviders((prev) => ({ ...prev, nurse: res.data.nurses || [] }));
    } catch (err) {
      console.error("Error fetching nurses:", err);
    }
  };

  const openEventModal = () => {
    setEventForm({
      title: "",
      description: "",
      location: "",
      date: "",
      time: "",
      type: "wellness",
    });
    setShowEventModal(true);
  };

  const handleProviderBooking = (serviceType, provider) => {
    setBookingForm({
      appointmentDate: "",
      timeSlot: "",
      notes: "",
      providerId: provider._id,
    });
    if (serviceType === "Companion") setShowCompanionModal(true);
    if (serviceType === "Doctor") setShowDoctorModal(true);
    if (serviceType === "Nurse") setShowNurseModal(true);
  };

  const handleProviderView = (provider) => {
    alert(
      `Provider: ${provider.name}\nRole: ${provider.role || provider.specialty || "Provider"}\nEmail: ${provider.email || "Not provided"}`,
    );
  };

  const handleCreateEvent = async () => {
    try {
      if (
        !eventForm.title.trim() ||
        !eventForm.location.trim() ||
        !eventForm.date
      ) {
        alert("Please enter event title, location, and date.");
        return;
      }

      await API.post("/family/events", {
        elderId: selectedElder,
        title: eventForm.title,
        description: eventForm.description,
        location: eventForm.location,
        date: eventForm.date,
        time: eventForm.time,
        type: eventForm.type,
      });

      setAlertMessage({
        type: "success",
        text: "Event created successfully!",
      });
      setShowEventModal(false);
      fetchFamilyEvents();
      await fetchAllData(selectedElder);
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      console.error("Error creating event", err);
      alert(err.response?.data?.message || "Failed to create event");
    }
  };

  const submitBooking = async (serviceType) => {
    if (!selectedElder) {
      alert("Please select an elder before booking.");
      return;
    }

    if (!bookingForm.appointmentDate) {
      alert("Please choose an appointment date.");
      return;
    }

    if (!bookingForm.timeSlot) {
      alert("Please choose a time slot.");
      return;
    }

    if (serviceType === "Doctor") {
      if (!bookingForm.providerId) {
        alert("Please select a doctor.");
        return;
      }
      if (!bookingForm.consultationType) {
        alert("Please select a consultation type.");
        return;
      }
      if (!bookingForm.notes.trim()) {
        alert("Please enter a reason for the visit.");
        return;
      }
    }

    try {
      const payload = {
        elderId: selectedElder,
        elderName: selectedElderDetails?.name,
        serviceType,
        appointmentDate: bookingForm.appointmentDate,
        timeSlot: bookingForm.timeSlot,
        consultationType: bookingForm.consultationType,
        notes: bookingForm.notes,
        reason: bookingForm.notes,
      };

      if (serviceType === "Doctor") {
        const selectedDoctor = providers.doctor.find(
          (doc) => doc._id === bookingForm.providerId,
        );
        if (selectedDoctor) {
          payload.doctorName = selectedDoctor.name;
          payload.specialty = selectedDoctor.specialty || "General";
          // Avoid sending providerId for doctor bookings when we already
          // resolve the selected doctor here, working around backend
          // providerId handling issues in booking creation.
        } else {
          payload.providerId = bookingForm.providerId;
        }
      } else {
        payload.providerId = bookingForm.providerId;
      }

      await API.post("/bookings/create", payload);
      await fetchAllData(selectedElder);
      setShowCompanionModal(false);
      setShowDoctorModal(false);
      setShowNurseModal(false);
    } catch (err) {
      console.error("Error creating booking", err);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  if (loading)
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading family dashboard...</p>
      </div>
    );

  return (
    <div className="family-dashboard">
      <div className="container-fluid py-4">
        {/* Alert Messages */}
        {alertMessage && (
          <div
            className={`alert alert-${alertMessage.type} alert-dismissible fade show mb-4`}
            role="alert"
          >
            {alertMessage.text}
            <button
              type="button"
              className="btn-close"
              onClick={() => setAlertMessage(null)}
            ></button>
          </div>
        )}

        {/* Header */}
        <div className="row mb-4 align-items-center">
          <div className="col-md-6">
            <h2 className="fw-bold">
              <i className="bi bi-house-heart-fill me-2"></i>Family Dashboard
            </h2>
            <p className="text-muted mb-0">
              Monitor and manage elder's health, activities & care
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => fetchAllData(selectedElder)}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>Refresh
            </button>
            <button className="btn btn-primary" onClick={downloadReport}>
              <i className="bi bi-download me-1"></i>Download Report
            </button>
          </div>
        </div>

        {/* Elder Selection & Add */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-6">
                <label className="fw-bold mb-2">Select Elder:</label>
                {elders.length === 0 ? (
                  <p className="alert alert-warning mb-0">
                    <i className="bi bi-exclamation-triangle me-2"></i>No linked
                    elders found.
                  </p>
                ) : (
                  <select
                    className="form-select"
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
              <div className="col-md-6 text-md-end mt-3 mt-md-0">
                <button
                  className="btn btn-outline-success btn-sm me-2"
                  onClick={() => setShowAddElderModal(true)}
                >
                  <i className="bi bi-plus-circle me-1"></i>Link Elder by
                  Username
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Elder Details Card */}
        {selectedElderDetails && (
          <div className="row mb-4">
            <div className="row-lg-4">
              <div className="card shadow-sm border-primary">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-person-circle me-2"></i>Elder Profile
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <strong>Name:</strong> {selectedElderDetails.name}
                  </div>
                  <div className="mb-3">
                    <strong>Username:</strong> @{selectedElderDetails.username}
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong> {selectedElderDetails.email}
                  </div>
                  <div className="mb-3">
                    <strong>Member Since:</strong>{" "}
                    {formatDate(selectedElderDetails.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Health Alerts */}
            {getHealthAlerts().length > 0 && (
              <div className="col-lg-4">
                <div className="card shadow-sm border-danger">
                  <div className="card-header bg-danger text-white">
                    <h5 className="mb-0">
                      <i className="bi bi-exclamation-circle me-2"></i>Health
                      Alerts
                    </h5>
                  </div>
                  <div className="card-body">
                    {getHealthAlerts().map((alert, idx) => (
                      <div key={idx} className="alert alert-warning mb-2">
                        <small className="fw-bold">
                          {formatDate(alert.createdAt)}
                        </small>
                        <p className="mb-0 mt-1">
                          BP: {alert.bloodPressure || "-"} | Sugar:{" "}
                          {alert.sugarLevel || "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="row-lg-4">
              <div className="row g-3">
                <div className="col-12">
                  <StatsCard
                    icon="🎮"
                    title="Game Sessions"
                    value={dashboardStats.gamesPlayed}
                    description="Total game sessions played"
                    variant="info"
                  />
                </div>
                <div className="col-12">
                  <StatsCard
                    icon="🏆"
                    title="Total Score"
                    value={dashboardStats.totalGameScore}
                    description="Accumulated score from games"
                    variant="success"
                  />
                </div>
                <div className="col-12">
                  <StatsCard
                    icon="⏱️"
                    title="Platform Time"
                    value={dashboardStats.platformMinutes}
                    suffix="min"
                    description="Estimated minutes on platform"
                    variant="warning"
                  />
                </div>
                <div className="col-12">
                  <StatsCard
                    icon="📅"
                    title="Average Daily Activity"
                    value={dashboardStats.dailyAverage}
                    suffix="min"
                    description="Average daily active time"
                    variant="danger"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="row mb-4">
          <div className="col-12">
            <div
              className="btn-group w-100 d-flex flex-wrap gap-2"
              role="group"
            >
              {/* <button
                className="btn btn-outline-success"
                onClick={() => setShowMessageModal(true)}
              >
                <i className="bi bi-chat-dots me-1"></i>Send Message
              </button>
              <button
                className="btn btn-outline-info"
                onClick={() => setShowCareNoteModal(true)}
              >
                <i className="bi bi-sticky me-1"></i>Add Care Note
              </button>
              <button
                className="btn btn-outline-warning"
                onClick={() => setShowDocumentModal(true)}
              >
                <i className="bi bi-file-earmark-pdf me-1"></i>Upload Document
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={() => openCompanionModal()}
              >
                <i className="bi bi-person-check me-1"></i>Book Companion
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => openDoctorModal()}
              >
                <i className="bi bi-stethoscope me-1"></i>Book Doctor
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => openNurseModal()}
              >
                <i className="bi bi-heart-pulse me-1"></i>Book Nurse
              </button> */}
              <button
                className="btn btn-outline-info"
                onClick={() => openEventModal()}
              >
                <i className="bi bi-calendar-event me-1"></i>Create Event
              </button>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="row-lg-4">
            <ProviderSection
              title="Available Companions"
              providers={providers.companion}
              loading={providerLoading}
              onView={(provider) => handleProviderView(provider)}
              onBook={(provider) =>
                handleProviderBooking("Companion", provider)
              }
            />
          </div>
          <div className="row-lg-4">
            <ProviderSection
              title="Available Doctors"
              providers={providers.doctor}
              loading={providerLoading}
              onView={(provider) => handleProviderView(provider)}
              onBook={(provider) => handleProviderBooking("Doctor", provider)}
            />
          </div>
          <div className="row-lg-4">
            <ProviderSection
              title="Available Nurses"
              providers={providers.nurse}
              loading={providerLoading}
              onView={(provider) => handleProviderView(provider)}
              onBook={(provider) => handleProviderBooking("Nurse", provider)}
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">
                  <i className="bi bi-calendar-event me-2"></i>Upcoming Events
                </h5>
              </div>
              <div className="card-body">
                {familyEvents.length === 0 ? (
                  <p className="text-muted">No events created yet.</p>
                ) : (
                  <div className="row row-cols-1 row-cols-md-3 g-3">
                    {familyEvents.slice(0, 3).map((event) => (
                      <div key={event._id} className="col">
                        <div className="border rounded p-3 h-100">
                          <h6 className="mb-1">{event.title}</h6>
                          <p className="mb-1 text-muted">{event.location}</p>
                          <p className="mb-1 small text-muted">
                            {new Date(event.date).toLocaleDateString()}{" "}
                            {event.time || ""}
                          </p>
                          <p className="small text-truncate">
                            {event.description || "No description"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ActivityTracker
          stats={dashboardStats}
          timeline={buildActivityTimeline(gameHistory, activityLog)}
        />

        {/* Health Records */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">
                  <i className="bi bi-heart-pulse me-2"></i>Health History
                </h5>
              </div>
              <div className="card-body">
                {healthData.length === 0 ? (
                  <p className="text-muted">No health records available.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Date</th>
                          <th>Blood Pressure</th>
                          <th>Blood Sugar</th>
                          <th>Weight</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {healthData.slice(0, 10).map((h, idx) => (
                          <tr key={idx}>
                            <td>{formatDate(h.createdAt || h.date)}</td>
                            <td>
                              <span className="badge bg-info">
                                {h.bloodPressure || "-"}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-warning">
                                {h.sugarLevel || "-"}
                              </span>
                            </td>
                            <td>{h.weight || "-"}</td>
                            <td className="text-muted small">
                              {h.notes || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="row mb-4">
          {/* Medicines */}
          <div className="row-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">
                  <i className="bi bi-capsule me-2"></i>Medicine Schedule
                </h5>
              </div>
              <div className="card-body">
                {medicines.length === 0 ? (
                  <p className="text-muted">No medicines recorded.</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {medicines.slice(0, 8).map((m, i) => (
                      <div key={i} className="list-group-item px-0 py-2">
                        <div className="fw-bold text-sm">
                          {m.medicineName || "Medicine"}
                        </div>
                        <small className="text-muted d-block">
                          {m.dosage || "Dosage not specified"}
                        </small>
                        <small className="badge bg-secondary">
                          {m.schedule || "--"}
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="card-footer bg-light">
                <Link
                  to="/medicines"
                  className="btn btn-sm btn-outline-primary w-100"
                >
                  <i className="bi bi-arrow-right me-1"></i>Manage Medicines
                </Link>
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="row-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">
                  <i className="bi bi-calendar-check me-2"></i>Bookings
                </h5>
              </div>
              <div className="card-body">
                {bookings.length === 0 ? (
                  <p className="text-muted">No bookings found.</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {bookings.slice(0, 8).map((b, i) => (
                      <div key={i} className="list-group-item px-0 py-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="fw-bold text-sm">
                              {b.service || b.type || "Appointment"}
                            </div>
                            <small className="text-muted">
                              {formatDate(b.appointmentDate || b.date)}
                            </small>
                          </div>
                          <span
                            className={`badge bg-${
                              b.status === "confirmed" ? "success" : "warning"
                            }`}
                          >
                            {b.status || "-"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="card-footer bg-light">
                <Link
                  to="/booking"
                  className="btn btn-sm btn-outline-primary w-100"
                >
                  <i className="bi bi-arrow-right me-1"></i>All Bookings
                </Link>
              </div>
            </div>
          </div>

          {/* care Notes */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">
                  <i className="bi bi-sticky me-2"></i>Care Notes
                </h5>
              </div>
              <div className="card-body">
                {careNotes.length === 0 ? (
                  <p className="text-muted">No care notes added.</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {careNotes.slice(0, 5).map((note, i) => (
                      <div key={i} className="list-group-item px-0 py-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="fw-bold text-sm">{note.title}</div>
                            <small className="text-muted d-block">
                              {note.content.substring(0, 40)}...
                            </small>
                            <small className="text-muted">
                              {formatDate(note.createdAt)}
                            </small>
                          </div>
                          <button
                            className="btn btn-link btn-sm text-danger"
                            onClick={() => handleDeleteCareNote(note._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline & Documents */}
        <div className="row mb-4">
          {/* Activity Log */}
          <div className="row-lg-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">
                  <i className="bi bi-clock-history me-2"></i>Activity Timeline
                </h5>
              </div>
              <div className="card-body">
                {activityLog.length === 0 ? (
                  <p className="text-muted">No recent activities.</p>
                ) : (
                  <div className="timeline">
                    {activityLog.slice(0, 10).map((activity, i) => (
                      <div key={i} className="mb-3">
                        <div className="d-flex">
                          <div className="me-3">
                            <span
                              className={`badge bg-${
                                activity.activityType === "Health"
                                  ? "danger"
                                  : activity.activityType === "Medicine"
                                    ? "warning"
                                    : activity.activityType === "Game"
                                      ? "info"
                                      : "secondary"
                              }`}
                            >
                              {activity.activityType}
                            </span>
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-1 fw-bold">
                              {activity.description}
                            </p>
                            <small className="text-muted">
                              {formatDate(activity.createdAt)}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documents */}
          {/* <div className="col-lg-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">
                  <i className="bi bi-file-earmark me-2"></i>Documents
                </h5>
              </div>
              <div className="card-body">
                {documents.length === 0 ? (
                  <p className="text-muted">No documents uploaded.</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {documents.slice(0, 10).map((doc, i) => (
                      <div key={i} className="list-group-item px-0 py-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="fw-bold text-sm">
                              <i className="bi bi-file-earmark-pdf me-1"></i>
                              {doc.fileName}
                            </div>
                            <div className="d-flex gap-2 mt-1">
                              <small className="badge bg-primary">
                                {doc.documentType}
                              </small>
                              <small className="text-muted">
                                {formatDate(doc.createdAt)}
                              </small>
                            </div>
                          </div>
                          <button
                            className="btn btn-link btn-sm text-danger"
                            onClick={() => handleDeleteDocument(doc._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div> */}
        </div>

        {/* Messages */}
        {/* <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">
                  <i className="bi bi-chat-left-text me-2"></i>Family Messages &
                  Instructions
                </h5>
              </div>
              <div className="card-body">
                {familyMessages.length === 0 ? (
                  <p className="text-muted">No messages sent.</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {familyMessages.slice(0, 10).map((msg, i) => (
                      <div key={i} className="list-group-item px-0 py-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="badge bg-secondary">
                                {msg.messageType}
                              </span>
                              <small className="text-muted">
                                {formatDate(msg.createdAt)}
                              </small>
                            </div>
                            <p className="mb-0">{msg.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* ========== MODALS ========== */}

      {/* Add Elder Modal */}
      {showAddElderModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person-plus me-2"></i>Link New Elder
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddElderModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Elder Username:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., @john_elder"
                    value={newElderForm.username}
                    onChange={(e) =>
                      setNewElderForm({
                        ...newElderForm,
                        username: e.target.value,
                      })
                    }
                  />
                  <small className="text-muted">
                    Enter the exact username of the elder you want to link
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddElderModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddElder}
                  disabled={addingElder}
                >
                  {addingElder ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Linking...
                    </>
                  ) : (
                    "Link Elder"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Care Note Modal */}
      {showCareNoteModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-sticky me-2"></i>Add Care Note
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCareNoteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Medication reminder"
                    value={careNoteForm.title}
                    onChange={(e) =>
                      setCareNoteForm({
                        ...careNoteForm,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Note:</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Enter care instructions or notes..."
                    value={careNoteForm.content}
                    onChange={(e) =>
                      setCareNoteForm({
                        ...careNoteForm,
                        content: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Category:</label>
                    <select
                      className="form-select"
                      value={careNoteForm.category}
                      onChange={(e) =>
                        setCareNoteForm({
                          ...careNoteForm,
                          category: e.target.value,
                        })
                      }
                    >
                      <option>General</option>
                      <option>Instructions</option>
                      <option>Reminder</option>
                      <option>Alert</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Priority:</label>
                    <select
                      className="form-select"
                      value={careNoteForm.priority}
                      onChange={(e) =>
                        setCareNoteForm({
                          ...careNoteForm,
                          priority: e.target.value,
                        })
                      }
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCareNoteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveCareNote}
                  disabled={savingNote}
                >
                  {savingNote ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Saving...
                    </>
                  ) : (
                    "Save Note"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {showDocumentModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-file-earmark-arrow-up me-2"></i>Upload
                  Document
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDocumentModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Document Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Medical Report - April 2024"
                    value={documentForm.fileName}
                    onChange={(e) =>
                      setDocumentForm({
                        ...documentForm,
                        fileName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Document Type:</label>
                  <select
                    className="form-select"
                    value={documentForm.documentType}
                    onChange={(e) =>
                      setDocumentForm({
                        ...documentForm,
                        documentType: e.target.value,
                      })
                    }
                  >
                    <option>Other</option>
                    <option>Prescription</option>
                    <option>Report</option>
                    <option>Insurance</option>
                    <option>Medical History</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Description:</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Optional notes about this document..."
                    value={documentForm.description}
                    onChange={(e) =>
                      setDocumentForm({
                        ...documentForm,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>In this version,
                  documents are logged without file upload. File upload will be
                  implemented soon.
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDocumentModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUploadDocument}
                >
                  <i className="bi bi-upload me-1"></i>Upload Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-chat-dots me-2"></i>Send Message to Elder
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowMessageModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Message Type:</label>
                  <select
                    className="form-select"
                    value={messageForm.messageType}
                    onChange={(e) =>
                      setMessageForm({
                        ...messageForm,
                        messageType: e.target.value,
                      })
                    }
                  >
                    <option>Note</option>
                    <option>Instruction</option>
                    <option>Reminder</option>
                    <option>Alert</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Message:</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Type your message here..."
                    value={messageForm.message}
                    onChange={(e) =>
                      setMessageForm({
                        ...messageForm,
                        message: e.target.value,
                      })
                    }
                  ></textarea>
                  <small className="text-muted">
                    {messageForm.message.length}/500 characters
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMessageModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSendMessage}
                  disabled={savingMessage}
                >
                  {savingMessage ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-1"></i>Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Companion Modal */}
      {showCompanionModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person-check me-2"></i>Book Companion
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCompanionModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {!bookingForm.providerId ? (
                  <>
                    <p className="text-muted mb-3">
                      Select a companion from the list:
                    </p>
                    <div className="list-group">
                      {providers.companion.length === 0 ? (
                        <p className="text-muted">No companions available</p>
                      ) : (
                        providers.companion.map((p) => (
                          <button
                            key={p._id}
                            type="button"
                            className="list-group-item list-group-item-action"
                            onClick={() =>
                              setBookingForm((prev) => ({
                                ...prev,
                                providerId: p._id,
                              }))
                            }
                          >
                            <div className="fw-bold">{p.name}</div>
                            <small>{p.email}</small>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="alert alert-info">
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
                          setBookingForm((prev) => ({
                            ...prev,
                            providerId: "",
                          }))
                        }
                      >
                        Change
                      </button>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Date:</label>
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
                    <div className="mb-3">
                      <label className="form-label fw-bold">Time Slot:</label>
                      <select
                        className="form-select"
                        value={bookingForm.timeSlot}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            timeSlot: e.target.value,
                          }))
                        }
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
                      <label className="form-label fw-bold">Notes:</label>
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
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCompanionModal(false)}
                >
                  Cancel
                </button>
                {bookingForm.providerId && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => submitBooking("Companion")}
                  >
                    <i className="bi bi-check me-1"></i>Confirm Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Modal */}
      {showDoctorModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-stethoscope me-2"></i>Book Doctor
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDoctorModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {!bookingForm.providerId ? (
                  <>
                    <p className="text-muted mb-3">
                      Select a doctor from the list:
                    </p>
                    <div className="list-group">
                      {providers.doctor.length === 0 ? (
                        <p className="text-muted">No doctors available</p>
                      ) : (
                        providers.doctor.map((doctor) => (
                          <button
                            key={doctor._id}
                            type="button"
                            className="list-group-item list-group-item-action"
                            onClick={() =>
                              setBookingForm((prev) => ({
                                ...prev,
                                providerId: doctor._id,
                              }))
                            }
                          >
                            <div className="fw-bold">{doctor.name}</div>
                            <div className="d-flex gap-2 mt-1">
                              <small className="badge bg-primary">
                                {doctor.specialty || "General"}
                              </small>
                              <small className="text-muted">
                                {doctor.email}
                              </small>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="alert alert-info">
                      Selected:{" "}
                      <strong>
                        {
                          providers.doctor.find(
                            (d) => d._id === bookingForm.providerId,
                          )?.name
                        }
                      </strong>
                      <button
                        className="btn btn-link btn-sm float-end"
                        onClick={() =>
                          setBookingForm((prev) => ({
                            ...prev,
                            providerId: "",
                          }))
                        }
                      >
                        Change
                      </button>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Appointment Date:
                      </label>
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
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Consultation Type:
                      </label>
                      <select
                        className="form-select"
                        value={bookingForm.consultationType}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            consultationType: e.target.value,
                          }))
                        }
                        required
                      >
                        <option value="In-person">In-person</option>
                        <option value="Video Call">Video Call</option>
                        <option value="Home Visit">Home Visit</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Time Slot:</label>
                      <select
                        className="form-select"
                        value={bookingForm.timeSlot}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            timeSlot: e.target.value,
                          }))
                        }
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
                      <label className="form-label fw-bold">
                        Reason for Visit:
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Describe the medical concern..."
                        value={bookingForm.notes}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        required
                      ></textarea>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDoctorModal(false)}
                >
                  Cancel
                </button>
                {bookingForm.providerId && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => submitBooking("Doctor")}
                  >
                    <i className="bi bi-calendar-check me-1"></i>Book Doctor
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nurse Modal */}
      {showNurseModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-heart-pulse me-2"></i>Book Nurse
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowNurseModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {!bookingForm.providerId ? (
                  <>
                    <p className="text-muted mb-3">
                      Select a nurse from the list:
                    </p>
                    <div className="list-group">
                      {providers.nurse.length === 0 ? (
                        <p className="text-muted">No nurses available</p>
                      ) : (
                        providers.nurse.map((nurse) => (
                          <button
                            key={nurse._id}
                            type="button"
                            className="list-group-item list-group-item-action"
                            onClick={() =>
                              setBookingForm((prev) => ({
                                ...prev,
                                providerId: nurse._id,
                              }))
                            }
                          >
                            <div className="fw-bold">{nurse.name}</div>
                            <div className="d-flex gap-2 mt-1">
                              <small className="badge bg-success">
                                {nurse.specialty || "General"}
                              </small>
                              <small className="text-muted">
                                {nurse.email}
                              </small>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="alert alert-info">
                      Selected:{" "}
                      <strong>
                        {
                          providers.nurse.find(
                            (n) => n._id === bookingForm.providerId,
                          )?.name
                        }
                      </strong>
                      <button
                        className="btn btn-link btn-sm float-end"
                        onClick={() =>
                          setBookingForm((prev) => ({
                            ...prev,
                            providerId: "",
                          }))
                        }
                      >
                        Change
                      </button>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Appointment Date:
                      </label>
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
                    <div className="mb-3">
                      <label className="form-label fw-bold">Time Slot:</label>
                      <select
                        className="form-select"
                        value={bookingForm.timeSlot}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            timeSlot: e.target.value,
                          }))
                        }
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
                      <label className="form-label fw-bold">
                        Service Required:
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Describe the nursing care needed..."
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
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNurseModal(false)}
                >
                  Cancel
                </button>
                {bookingForm.providerId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => submitBooking("Nurse")}
                  >
                    <i className="bi bi-calendar-check me-1"></i>Book Nurse
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-calendar-event me-2"></i>Create Event
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEventModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Event Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Elder yoga workshop"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Location:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={eventForm.location}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Community hall"
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Event Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      value={eventForm.date}
                      onChange={(e) =>
                        setEventForm((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Time:</label>
                    <input
                      type="time"
                      className="form-control"
                      value={eventForm.time}
                      onChange={(e) =>
                        setEventForm((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Description:</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={eventForm.description}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Add event details for elder participation..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEventModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateEvent}
                >
                  <i className="bi bi-plus me-1"></i>Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FamilyDashboard;
