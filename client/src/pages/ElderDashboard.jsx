import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./ElderDashboard.css";

function ElderDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [healthData, setHealthData] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [games, setGames] = useState([]);
  const [yogaActivities, setYogaActivities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [companions, setCompanions] = useState([]);
  const [loadingCompanions, setLoadingCompanions] = useState(true);

  const dummyCompanions = [
  {
    _id: "dummy1",
    name: "Priya Sharma",
    role: "Healthcare Aide",
    availability: "✓ Available today"
  },
  {
    _id: "dummy2",
    name: "Rajesh Kumar",
    role: "Outdoor Companion",
    availability: "✓ Available today"
  },
  {
    _id: "dummy3",
    name: "Meena Devi",
    role: "Activity Partner",
    availability: "✓ Available today"
  }
];

useEffect(() => {
  fetchDashboardCompanions();
}, []);

const fetchDashboardCompanions = async () => {
  try {
    const res = await API.get("/companions");
    const backendCompanions = res.data.companions || [];

    if (backendCompanions.length > 0) {
      const formattedCompanions = backendCompanions.slice(0, 3).map((c) => ({
        _id: c._id,
        name: c.name || "Unknown",
        role: c.specialty || c.specialization || "Companion",
        availability: "✓ Available today"
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
    state: { companion }
  });
};

const handleViewCompanionProfile = (companion) => {
  navigate(`/companions/${companion._id}`, {
    state: { companion }
  });
};

  
  const [stats, setStats] = useState({
    healthScore: 85,
    doctorsConsulted: 0,
    medicinesTaken: 0,
    eventsBooked: 0,
    activeDays: 0,
    yogaSessions: 0
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
      setMedicines(medicineRes.data || []);

      // Fetch games
      const gameRes = await API.get("/games/list");
      setGames(gameRes.data || []);

      // Fetch yoga activities
      // const yogaRes = await API.get("/yoga/list");
      // setYogaActivities(yogaRes.data || []);
      const yogaRes = await API.get("/yoga/list");  // Add /api prefix
      setYogaActivities(yogaRes.data || []);  // Matches new route response 
      //Fetching yoga sessions for stats
      const sessionRes = await API.get("/yoga/my-sessions");
      const yogaSessions = sessionRes.data || [];
      // Fetch bookings
      const bookingRes = await API.get("/bookings/my-bookings");
      setBookings(bookingRes.data.bookings || []);

      // Calculate stats
      calculateStats(healthRes.data, medicineRes.data, gameRes.data, yogaRes.data, bookingRes.data.bookings, yogaSessions);

      // Initialize chat with greeting
      setChatMessages([
        {
          id: 1,
          sender: "bot",
          text: "Namaste! 🙏 How are you feeling today?"
        }
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
      doctorsConsulted: new Set(bkgs.map(b => b.doctorName)).size,
      medicinesTaken: meds.length || 0,
      eventsBooked: bkgs.filter(b => b.status !== "Cancelled").length,
      activeDays: health.length || 0,
      yogaSessions: yogaData.length || 0
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMsg = {
      id: chatMessages.length + 1,
      sender: "user",
      text: newMessage
    };
    setChatMessages([...chatMessages, userMsg]);
    setNewMessage("");

    // Simulate bot response (replace with actual chatbot API call)
    setTimeout(() => {
      const botMsg = {
        id: chatMessages.length + 2,
        sender: "bot",
        text: "That's wonderful! Keep up the healthy lifestyle. 💪"
      };
      setChatMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  const getLatestHealth = () => {
    if (healthData.length === 0) return null;
    return healthData[0];
  };

  const getUpcomingBooking = () => {
    const upcoming = bookings.filter(b => new Date(b.appointmentDate) > new Date());
    return upcoming.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))[0];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
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
            <p className="health-status">Your health is looking great today. You have 2 medicines pending and 1 event nearby.</p>
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
                    <div className="metric-progress" style={{ width: "70%" }}></div>
                  </div>
                </div>
              </div>
              <div className="health-metric">
                <div className="metric-icon sugar">🍬</div>
                <div className="metric-content">
                  <p className="metric-label">Blood Sugar</p>
                  <p className="metric-value">{latestHealth.sugarLevel}</p>
                  <div className="metric-bar">
                    <div className="metric-progress" style={{ width: "68%" }}></div>
                  </div>
                </div>
              </div>
              <div className="health-metric">
                <div className="metric-icon weight">⚖️</div>
                <div className="metric-content">
                  <p className="metric-label">Weight</p>
                  <p className="metric-value">68 kg</p>
                  <div className="metric-bar">
                    <div className="metric-progress" style={{ width: "72%" }}></div>
                  </div>
                </div>
              </div>
              <div className="health-metric">
                <div className="metric-icon heart">💓</div>
                <div className="metric-content">
                  <p className="metric-label">Heart Rate</p>
                  <p className="metric-value">72 bpm</p>
                  <div className="metric-bar">
                    <div className="metric-progress" style={{ width: "75%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="no-data">No health data recorded yet.</p>
          )}
          <Link to="/health" className="view-more-btn">View Details →</Link>
        </div>

        {/* Medicine Reminders */}
        <div className="dashboard-section medicine-reminders">
          <div className="section-header">
            <h3>💊 Medicine Reminders</h3>
            <span className="section-badge">{medicines.length} medications</span>
          </div>
          {medicines.length > 0 ? (
            <div className="reminder-list">
              {medicines.slice(0, 4).map((med, idx) => (
                <div key={idx} className="reminder-item">
                  <div className="reminder-icon">💊</div>
                  <div className="reminder-content">
                    <p className="reminder-name">{med.medicineName || "Medicine"}</p>
                    <p className="reminder-time">{med.dosage || "As prescribed"}, 8:00 AM</p>
                  </div>
                  <button className="reminder-btn">Undo</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No medicines scheduled.</p>
          )}
          <Link to="/health" className="view-more-btn">View All →</Link>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Mind Games */}
        <div className="dashboard-section mind-games">
          <h3>🎮 Mind Games</h3>
          {games.length > 0 ? (
            <div className="games-list">
              {games.slice(0, 3).map((game, idx) => (
                <div key={idx} className="game-item">
                  <div className="game-icon">🎯</div>
                  <div className="game-content">
                    <p className="game-name">{game.gameName}</p>
                    <p className="game-score">Score: {game.score} • Best: 1100</p>
                  </div>
                  <button className="play-btn">Play</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No games available.</p>
          )}
          <Link to="/games" className="view-more-btn">View All →</Link>
        </div>

        {/* Yoga & Breathing */}
        <div className="dashboard-section yoga-breathing">
          <h3>🧘 Yoga & Breathing</h3>
          {yogaActivities.length > 0 ? (
            <div className="yoga-list">
              {yogaActivities.slice(0, 3).map((yoga, idx) => (
                <div key={idx} className="yoga-item">
                  <div className="yoga-icon">🍃</div>
                  <div className="yoga-content">
                    <p className="yoga-name">{yoga.title}</p>
                    <p className="yoga-level">{yoga.duration} • {yoga.benefits}</p>
                  </div>
                  <button className="start-btn">Start</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No yoga activities available.</p>
          )}
          <Link to="/yoga" className="view-more-btn">View All →</Link>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Local Events */}
        <div className="dashboard-section local-events">
          <h3>📍 Local Events</h3>
          <div className="events-list">
            <div className="event-item">
              <div className="event-header">
                <p className="event-name">Morning Walk Group</p>
                <span className="event-tag">Health</span>
              </div>
              <p className="event-time">📅 Today, 6:30 AM</p>
              <p className="event-location">📍 Outdoor Park</p>
              <p className="event-attendance">👥 12 attending</p>
            </div>
            <div className="event-item">
              <div className="event-header">
                <p className="event-name">Bhajan Sandhya</p>
                <span className="event-tag">Social</span>
              </div>
              <p className="event-time">📅 Tomorrow, 5:00 PM</p>
              <p className="event-location">📍 Community Hall</p>
              <p className="event-attendance">👥 30 attending</p>
            </div>
            <div className="event-item">
              <div className="event-header">
                <p className="event-name">Senior Art Workshop</p>
                <span className="event-tag">Creative</span>
              </div>
              <p className="event-time">📅 Feb 27, 10:00 AM</p>
              <p className="event-location">📍 Cultural Center</p>
              <p className="event-attendance">👥 8 attending</p>
            </div>
          </div>
          <Link to="/booking" className="view-more-btn">View All →</Link>
        </div>

        {/* Book a Companion */}
        {/* <div className="dashboard-section book-companion">
          <h3>👥 Book a Companion</h3>
          <div className="companions-list">
            <div className="companion-card">
              <div className="companion-avatar">PS</div>
              <div className="companion-info">
                <p className="companion-name">Priya Sharma</p>
                <p className="companion-role">Healthcare Aide</p>
                <p className="companion-availability">✓ Available today</p>
              </div>
              <button className="book-btn">Book</button>
            </div>
            <div className="companion-card">
              <div className="companion-avatar">RK</div>
              <div className="companion-info">
                <p className="companion-name">Rajesh Kumar</p>
                <p className="companion-role">Outdoor Companion</p>
                <p className="companion-availability">✓ Available today</p>
              </div>
              <button className="book-btn">Book</button>
            </div>
            <div className="companion-card">
              <div className="companion-avatar">MD</div>
              <div className="companion-info">
                <p className="companion-name">Meena Devi</p>
                <p className="companion-role">Activity Partner</p>
                <p className="companion-availability">✓ Available today</p>
              </div>
              <button className="book-btn">Book</button>
            </div>
          </div>
          <Link to="/companions" className="view-more-btn">View All →</Link>
        </div> */}

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

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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

      {/* Chat Companion */}
      <div className="dashboard-section chat-companion">
        <h3>💬 Chat Companion</h3>
        <div className="chat-box">
          <div className="chat-messages">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                {msg.sender === "bot" && <div className="chat-avatar bot">🤖</div>}
                <div className="message-text">{msg.text}</div>
                {msg.sender === "user" && <div className="chat-avatar user">👤</div>}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">📤</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ElderDashboard;
