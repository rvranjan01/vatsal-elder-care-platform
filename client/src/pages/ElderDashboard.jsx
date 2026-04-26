import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import API from "../services/api";
// import gamesData from "../components/games/gamesData";
import ChatLauncher from "../components/chat/ChatLauncher";
import ChatOffcanvas from "../components/chat/ChatOffcanvas";
import "./ElderDashboard.css";

function ElderDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [healthData, setHealthData] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [medicineReminders, setMedicineReminders] = useState([]);
  const [games, setGames] = useState([]);
  const [yogaActivities, setYogaActivities] = useState([]);
  const [localEvents, setLocalEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  // ............
  const [showChat, setShowChat] = useState(false);
  // ...........
  const [newMessage, setNewMessage] = useState("");

  const [companions, setCompanions] = useState([]);
  const [loadingCompanions, setLoadingCompanions] = useState(true);

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const [nurses, setNurses] = useState([]);
  const [loadingNurses, setLoadingNurses] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState([]);
  const [loadingDoctorNotes, setLoadingDoctorNotes] = useState(false);

  const dummyCompanions = [
    {
      _id: "dummy1",
      name: "Priya Sharma",
      role: "Healthcare Aide",
      availability: "✓ Available today",
    },
    {
      _id: "dummy2",
      name: "Rajesh Kumar",
      role: "Outdoor Companion",
      availability: "✓ Available today",
    },
    {
      _id: "dummy3",
      name: "Meena Devi",
      role: "Activity Partner",
      availability: "✓ Available today",
    },
  ];

  const dummyDoctors = [
    {
      _id: "doctor1",
      name: "Dr. Amit Verma",
      role: "General Physician",
      availability: "✓ Available today",
    },
    {
      _id: "doctor2",
      name: "Dr. Sneha Reddy",
      role: "Cardiologist",
      availability: "✓ Available today",
    },
    {
      _id: "doctor3",
      name: "Dr. Kiran Rao",
      role: "Orthopedic Specialist",
      availability: "✓ Available today",
    },
  ];

  const dummyNurses = [
    {
      _id: "nurse1",
      name: "Nurse Kavya",
      role: "Home Care Nurse",
      availability: "✓ Available today",
    },
    {
      _id: "nurse2",
      name: "Nurse Deepa",
      role: "Medication Support Nurse",
      availability: "✓ Available today",
    },
    {
      _id: "nurse3",
      name: "Nurse Arjun",
      role: "Elder Care Nurse",
      availability: "✓ Available today",
    },
  ];

  useEffect(() => {
    fetchDashboardCompanions();
    fetchDashboardDoctors();
    fetchDashboardNurses();
  }, []);

  const fetchDashboardCompanions = async () => {
    try {
      const res = await API.get("/companions");
      const backendCompanions = res.data.companions || [];

      if (backendCompanions.length > 0) {
        const formattedCompanions = backendCompanions.slice(0, 3).map((c) => ({
          ...c,
          _id: c._id,
          name: c.name || "Unknown",
          email: c.email || "",
          specialty: c.specialty || c.specialization || "Companion",
          experience: c.experience || "",
          role: c.specialty || c.specialization || "Companion",
          availability: "✓ Available today",
        }));

        setCompanions(formattedCompanions);
      } else {
        setCompanions(dummyCompanions);
      }
    } catch (error) {
      console.error("Error fetching companions:", error);
      setCompanions(dummyCompanions);
    } finally {
      setLoadingCompanions(false);
    }
  };

  const fetchDashboardDoctors = async () => {
    try {
      setLoadingDoctors(true);

      const res = await API.get("/doctors");
      const formattedDoctors = (res.data.doctors || []).map((doctor) => ({
        ...doctor,
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email || "",
        specialty: doctor.specialty || "Doctor",
        experience: doctor.experience || "",
        role: doctor.specialty || "Doctor",
        availability: doctor.isActive ? "✓ Available today" : "Not available",
      }));

      setDoctors(formattedDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchDashboardNurses = async () => {
    try {
      setLoadingNurses(true);

      const res = await API.get("/nurses");
      const formattedNurses = (res.data.nurses || []).map((nurse) => ({
        ...nurse,
        _id: nurse._id,
        name: nurse.name,
        email: nurse.email || "",
        specialty: nurse.specialty || "Nurse",
        experience: nurse.experience || "",
        role: nurse.specialty || "Nurse",
        availability: nurse.isActive ? "✓ Available today" : "Not available",
      }));

      setNurses(formattedNurses);
    } catch (error) {
      console.error("Error fetching nurses:", error);
      setNurses([]);
    } finally {
      setLoadingNurses(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "NA";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleBookCompanion = (companion) => {
    const isDummy = companion._id.startsWith("dummy");

    if (isDummy) {
      alert("Dummy companion is for demo only.");
      return;
    }

    navigate(`/companions/${companion._id}/book`, {
      state: { companion },
    });
  };

  const handleViewCompanionProfile = (companion) => {
    navigate(`/companions/${companion._id}`, {
      state: { companion },
    });
  };

  const handleBookDoctor = (doctor) => {
    navigate(`/doctors/${doctor._id}/book`, {
      state: { doctor },
    });
  };

  const handleViewDoctorProfile = (doctor) => {
    navigate(`/doctors/${doctor._id}`, {
      state: { doctor },
    });
  };

  const handleBookNurse = (nurse) => {
    navigate(`/nurses/${nurse._id}/book`, {
      state: { nurse },
    });
  };

  const handleViewNurseProfile = (nurse) => {
    navigate(`/nurses/${nurse._id}`, {
      state: { nurse },
    });
  };

  const [stats, setStats] = useState({
    healthScore: 85,
    doctorsConsulted: 0,
    medicinesTaken: 0,
    eventsBooked: 0,
    activeDays: 0,
    yogaSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  // Get user data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.name);
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch health data
      const healthRes = await API.get("/health/list");
      setHealthData(healthRes.data || []);

      // Fetch medicines
      const medicineRes = await API.get("/medicines/list");
      // setMedicines(medicineRes.data || []);
      setMedicines(medicineRes.data.medicines || []);

      const reminderRes = await API.get("/medicines/reminders/upcoming");
      setMedicineReminders(reminderRes.data.reminders || []);

      // Fetch games
      const [gameRes, bestScoresRes] = await Promise.all([
        API.get("/games/games-list"),
        API.get("/games/best-scores"),
      ]);

      const gamesData = gameRes.data || [];
      const bestScoresData = bestScoresRes.data || [];

      const bestScoreMap = {};
      bestScoresData.forEach((item) => {
        bestScoreMap[item._id] = item.bestScore;
      });

      const mergedGames = gamesData.map((game) => ({
        ...game,
        bestScore: bestScoreMap[game._id] || 0,
      }));

      setGames(mergedGames);

      const yogaRes = await API.get("/yoga/list"); // Add /api prefix
      setYogaActivities(yogaRes.data || []); // Matches new route response
      //Fetching yoga sessions for stats
      const sessionRes = await API.get("/yoga/my-sessions");
      const yogaSessions = sessionRes.data || [];

      const eventsRes = await API.get("/local-events");
      setLocalEvents(eventsRes.data.events || []);
      // Fetch bookings
      const bookingRes = await API.get("/bookings/my-bookings");
      setBookings(bookingRes.data.bookings || []);

      // Fetch doctor notes
      try {
        const doctorNotesRes = await API.get("/doctors/notes");
        setDoctorNotes(doctorNotesRes.data.notes || []);
      } catch (err) {
        console.error("Error fetching doctor notes:", err);
        setDoctorNotes([]);
      }

      // Calculate stats
      calculateStats(
        healthRes.data,
        medicineRes.data,
        gameRes.data,
        yogaRes.data,
        bookingRes.data.bookings,
        yogaSessions,
      );

      // Initialize chat with greeting
      setChatMessages([
        {
          id: 1,
          sender: "bot",
          text: "Namaste! 🙏 How are you feeling today?",
        },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (health, meds, gms, yogaData, bkgs) => {
    setStats({
      healthScore: health.length > 0 ? 85 : 70,
      doctorsConsulted: new Set(bkgs.map((b) => b.doctorName)).size,
      medicinesTaken: meds.length || 0,
      eventsBooked: bkgs.filter((b) => b.status !== "Cancelled").length,
      activeDays: health.length || 0,
      yogaSessions: yogaData.length || 0,
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMsg = {
      id: chatMessages.length + 1,
      sender: "user",
      text: newMessage,
    };
    setChatMessages([...chatMessages, userMsg]);
    setNewMessage("");

    // Simulate bot response (replace with actual chatbot API call)
    setTimeout(() => {
      const botMsg = {
        id: chatMessages.length + 2,
        sender: "bot",
        text: "That's wonderful! Keep up the healthy lifestyle. 💪",
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  const getLatestHealth = () => {
    if (healthData.length === 0) return null;
    return healthData[0];
  };

  const getUpcomingBooking = () => {
    const upcoming = bookings.filter(
      (b) => new Date(b.appointmentDate) > new Date(),
    );
    return upcoming.sort(
      (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate),
    )[0];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return <div className="text-center p-5">Loading dashboard...</div>;
  }

  const latestHealth = getLatestHealth();
  const upcomingBooking = getUpcomingBooking();

  return (
    <div className="elder-dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          {/* elder image  */}
          {/* <img src="https://via.placeholder.com/80" alt="Elder" className="welcome-avatar" /> */}
          <div className="welcome-text">
            <p className="greeting">Good Afternoon 🙏</p>
            <h2>Welcome back, {userName}!</h2>
            {/* <p className="health-status">Your health is looking great today. You have 2 medicines pending and 1 event nearby.</p> */}
            <p className="health-status">
              Your health is looking great today. You have{" "}
              {
                medicineReminders.filter((item) => item.status === "pending")
                  .length
              }{" "}
              medicine reminder(s) pending and {localEvents.length} event(s)
              nearby.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {/* <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon health-icon">❤️</div>
          <p className="stat-value">{stats.healthScore}%</p>
          <p className="stat-label">Health Score</p>
          <span className="stat-change">↑ 2%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon doctor-icon">👨‍⚕️</div>
          <p className="stat-value">{stats.doctorsConsulted}</p>
          <p className="stat-label">Doctors Consulted</p>
          <span className="stat-change">This week</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon medicine-icon">💊</div>
          <p className="stat-value">{stats.medicinesTaken}</p>
          <p className="stat-label">Medicines Taken</p>
          <span className="stat-change">On track</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon calendar-icon">📅</div>
          <p className="stat-value">{stats.eventsBooked}</p>
          <p className="stat-label">Events Booked</p>
          <span className="stat-change">This month</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon activity-icon">📊</div>
          <p className="stat-value">{stats.activeDays}</p>
          <p className="stat-label">Active Days</p>
          <span className="stat-change">This month</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon yoga-icon">🧘</div>
          <p className="stat-value">{stats.yogaSessions}</p>
          <p className="stat-label">Yoga Sessions</p>
          <span className="stat-change">This month</span>
        </div>
      </div> */}

      <div className="dashboard-grid">
        {/* Health Overview */}
        <div className="dashboard-section health-overview">
          <h3>❤️ Health Overview</h3>
          {latestHealth ? (
            <div className="health-metrics">
              <div className="health-metric">
                <div className="metric-icon bp">🩸</div>
                <div className="metric-content">
                  <p className="metric-label">Blood Pressure</p>
                  <p className="metric-value">{latestHealth.bloodPressure}</p>
                  <div className="metric-bar">
                    <div
                      className="metric-progress"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="health-metric">
                <div className="metric-icon sugar">🍬</div>
                <div className="metric-content">
                  <p className="metric-label">Blood Sugar</p>
                  <p className="metric-value">{latestHealth.sugarLevel}</p>
                  <div className="metric-bar">
                    <div
                      className="metric-progress"
                      style={{ width: "68%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="health-metric">
                <div className="metric-icon weight">⚖️</div>
                <div className="metric-content">
                  <p className="metric-label">Weight</p>
                  <p className="metric-value">68 kg</p>
                  <div className="metric-bar">
                    <div
                      className="metric-progress"
                      style={{ width: "72%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="health-metric">
                <div className="metric-icon heart">💓</div>
                <div className="metric-content">
                  <p className="metric-label">Heart Rate</p>
                  <p className="metric-value">72 bpm</p>
                  <div className="metric-bar">
                    <div
                      className="metric-progress"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="no-data">No health data recorded yet.</p>
          )}
          <Link to="/health" className="view-more-btn">
            View Details →
          </Link>
        </div>

        {/* Doctor Notes Section */}
        {/* {doctorNotes.length > 0 && (
          <div className="dashboard-section doctor-notes">
            <div className="section-header">
              <h3>📋 Doctor's Notes & Suggestions</h3>
            </div>
            <div className="notes-list">
              {doctorNotes.slice(0, 5).map((note, idx) => (
                <div key={idx} className="note-card">
                  <div className="note-header">
                    <span className="note-doctor">
                      {note.doctorName || "Doctor"}
                    </span>
                    <span
                      className={`badge bg-${
                        note.noteType === "prescription"
                          ? "primary"
                          : note.noteType === "suggestion"
                            ? "info"
                            : note.noteType === "warning"
                              ? "warning"
                              : "secondary"
                      }`}
                    >
                      {note.noteType}
                    </span>
                  </div>
                  <p className="note-content">{note.note}</p>
                  <small className="note-date">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
            <Link to="/health" className="view-more-btn">
              View All Notes →
            </Link>
          </div>
        )} */}

        {/* Medicine Reminders */}
        <div className="dashboard-section medicine-reminders">
          <div className="section-header">
            <h3>💊 Medicine Reminders</h3>
            <span className="section-badge">
              {
                medicineReminders.filter((item) => item.status === "pending")
                  .length
              }{" "}
              pending
            </span>
          </div>

          {medicineReminders.length > 0 ? (
            <div className="reminder-list">
              {medicineReminders.slice(0, 4).map((reminder) => (
                <div key={reminder._id} className="reminder-item">
                  <div className="reminder-icon">
                    {reminder.medicineType === "injection" ? "💉" : "💊"}
                  </div>

                  <div className="reminder-content">
                    <p className="reminder-name">{reminder.medicineName}</p>
                    <p className="reminder-time">
                      {reminder.slot} • {reminder.dosage}
                    </p>
                    <p className="reminder-stock">
                      Stock: {reminder.currentStock}/{reminder.initialStock}
                      {reminder.lowStock && (
                        <span className="low-stock-tag ms-2">Low stock</span>
                      )}
                    </p>
                  </div>

                  <span
                    className={`reminder-status-badge ${
                      reminder.status === "taken"
                        ? "taken"
                        : reminder.status === "skipped"
                          ? "skipped"
                          : reminder.status === "missed"
                            ? "missed"
                            : "pending"
                    }`}
                  >
                    {reminder.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No medicine reminders for today.</p>
          )}

          <Link to="/medicines" className="view-more-btn">
            View All →
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Mind Games */}

        <div className="dashboard-section mind-games">
          <div className="section-header">
            <h3>🎮 Mind Games</h3>
            <span className="section-badge">{games.length} games</span>
          </div>

          {games.length > 0 ? (
            <div className="games-list">
              {games.slice(0, 3).map((game) => (
                <div key={game._id} className="game-item">
                  <div className="game-icon">{game.icon || "🎯"}</div>

                  <div className="game-content">
                    <p className="game-name">{game.gameName}</p>
                    <p className="game-score">
                      {game.category || "Mind Game"} • Best:{" "}
                      {game.bestScore || 0}
                    </p>
                  </div>

                  <button
                    className="play-btn"
                    onClick={() =>
                      navigate(`/games/${game._id}/play`, { state: { game } })
                    }
                  >
                    Play
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No games available.</p>
          )}

          <Link to="/games" className="view-more-btn">
            View All →
          </Link>
        </div>

        {/* Yoga & Breathing */}
        <div className="dashboard-section yoga-breathing">
          <h3>🧘 Yoga & Breathing</h3>
          {yogaActivities.length > 0 ? (
            <div className="yoga-list">
              {yogaActivities.slice(0, 3).map((yoga, idx) => (
                <div key={idx} className="yoga-item">
                  <div className="yoga-icon">
                    {yoga.imageUrl ? (
                      <img
                        src={yoga.imageUrl}
                        alt={yoga.title}
                        className="yoga-thumbnail"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <span>🍃</span>
                    )}
                  </div>
                  <div className="yoga-content">
                    <p className="yoga-name">{yoga.title}</p>
                    <p className="yoga-level">
                      {yoga.duration} min • {yoga.difficulty || "Beginner"}
                    </p>
                  </div>
                  <button
                    className="start-btn"
                    onClick={() => navigate("/yoga")}
                  >
                    Start
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No yoga activities available.</p>
          )}
          <Link to="/yoga" className="view-more-btn">
            View All →
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Local Events */}

        <div className="dashboard-section local-events">
          <h3>📍 Local Events</h3>
          <div className="events-list">
            {localEvents.length > 0 ? (
              localEvents.slice(0, 3).map((event) => (
                <div key={event._id} className="event-item">
                  <div className="event-header">
                    <p className="event-name">{event.title}</p>
                    <span
                      className={`event-tag ${
                        event.type === "health"
                          ? "bg-danger text-white"
                          : event.type === "social"
                            ? "bg-info text-white"
                            : event.type === "creative"
                              ? "bg-warning text-dark"
                              : "bg-success text-white"
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>
                  <p className="event-time">
                    📅 {new Date(event.date).toLocaleDateString()},{" "}
                    {event.time || "TBD"}
                  </p>
                  <p className="event-location">📍 {event.location}</p>
                </div>
              ))
            ) : (
              // Your existing hardcoded events as fallback
              <>
                <div className="event-item"> {/* Morning Walk Group */} </div>
                <div className="event-item"> {/* Bhajan Sandhya */} </div>
                <div className="event-item"> {/* Senior Art Workshop */} </div>
              </>
            )}
          </div>
          <Link to="/events" className="view-more-btn">
            View All →
          </Link>
        </div>

        {/* Book a Companion */}

        <div className="dashboard-section book-companion">
          <h3>👥 Book a Companion</h3>

          <div className="companions-list">
            {loadingCompanions ? (
              <p>Loading companions...</p>
            ) : (
              companions.map((companion) => {
                const isDummy = companion._id.startsWith("dummy");

                return (
                  <div className="companion-card" key={companion._id}>
                    <div className="companion-avatar">
                      {getInitials(companion.name)}
                    </div>

                    <div className="companion-info">
                      <p className="companion-name">{companion.name}</p>
                      <p className="companion-role">{companion.role}</p>
                      <p className="companion-availability">
                        {companion.availability}
                      </p>
                    </div>

                    <div
                      style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                    >
                      <button
                        className="book-btn"
                        onClick={() => handleViewCompanionProfile(companion)}
                      >
                        View
                      </button>

                      <button
                        className="book-btn"
                        disabled={isDummy}
                        onClick={() => handleBookCompanion(companion)}
                      >
                        {isDummy ? "Demo Only" : "Book"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <Link to="/companions" className="view-more-btn">
            View All →
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section book-companion">
          <h3>🩺 Book Doctor</h3>

          <div className="companions-list">
            {loadingDoctors ? (
              <p>Loading doctors...</p>
            ) : (
              doctors.map((doctor) => (
                <div className="companion-card" key={doctor._id}>
                  <div className="companion-avatar">
                    {getInitials(doctor.name)}
                  </div>

                  <div className="companion-info">
                    <p className="companion-name">{doctor.name}</p>
                    <p className="companion-role">{doctor.role}</p>
                    <p className="companion-availability">
                      {doctor.availability}
                    </p>
                  </div>

                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    <button
                      className="book-btn"
                      onClick={() => handleViewDoctorProfile(doctor)}
                    >
                      View
                    </button>

                    <button
                      className="book-btn"
                      onClick={() => handleBookDoctor(doctor)}
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link to="/doctors" className="view-more-btn">
            View All →
          </Link>
        </div>

        <div className="dashboard-section book-companion">
          <h3>🧑‍⚕️ Book Nurse</h3>

          <div className="companions-list">
            {loadingNurses ? (
              <p>Loading nurses...</p>
            ) : (
              nurses.map((nurse) => (
                <div className="companion-card" key={nurse._id}>
                  <div className="companion-avatar">
                    {getInitials(nurse.name)}
                  </div>

                  <div className="companion-info">
                    <p className="companion-name">{nurse.name}</p>
                    <p className="companion-role">{nurse.role}</p>
                    <p className="companion-availability">
                      {nurse.availability}
                    </p>
                  </div>

                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    <button
                      className="book-btn"
                      onClick={() => handleViewNurseProfile(nurse)}
                    >
                      View
                    </button>

                    <button
                      className="book-btn"
                      onClick={() => handleBookNurse(nurse)}
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link to="/nurses" className="view-more-btn">
            View All →
          </Link>
        </div>
      </div>
      <ChatLauncher onClick={() => setShowChat(true)} />
      <ChatOffcanvas
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        userName={userName}
      />
    </div>
  );
}

export default ElderDashboard;
