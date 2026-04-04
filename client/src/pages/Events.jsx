import { useEffect, useState } from "react";
import API from "../services/api";
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultEvents = [
    {
      _id: "event1",
      title: "Morning Walk Group",
      date: "2026-04-01",
      time: "6:30 AM",
      location: "Outdoor Park",
      type: "health",
      description:
        "Join a refreshing morning walk with other elders in the community.",
    },
    {
      _id: "event2",
      title: "Bhajan Sandhya",
      date: "2026-04-02",
      time: "5:00 PM",
      location: "Community Hall",
      type: "social",
      description:
        "A peaceful evening of bhajans, prayer, and community bonding.",
    },
    {
      _id: "event3",
      title: "Senior Art Workshop",
      date: "2026-04-05",
      time: "10:00 AM",
      location: "Cultural Center",
      type: "creative",
      description:
        "Fun painting and art activities designed for senior citizens.",
    },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/local-events");
      const list = res.data.events || [];
      setEvents(list);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const displayEvents = events.length > 0 ? events : defaultEvents;

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading events...</div>;
  }

  return (
    <div className="events-page">
      <div className="container mt-4 mb-4">
        <div className="events-header text-center">
          <h1>📍 Local Events</h1>
          <p>
            Stay connected with nearby wellness, social, and creative activities
            for elders.
          </p>
        </div>

        <div className="row g-4">
          {displayEvents.map((event) => (
            <div key={event._id} className="col-md-6 col-lg-4">
              <div
                className={`card shadow-sm h-100 event-card ${event.type || ""}`}
              >
                <div className="card-header d-flex justify-content-between align-items-center gap-2">
                  <h5 className="event-title">{event.title}</h5>
                  <span
                    className={`badge event-type-badge ${
                      event.type === "health"
                        ? "bg-danger"
                        : event.type === "social"
                          ? "bg-info text-dark"
                          : event.type === "creative"
                            ? "bg-warning text-dark"
                            : "bg-success"
                    }`}
                  >
                    {event.type}
                  </span>
                </div>

                <div className="card-body">
                  <div className="event-meta">
                    <span className="event-meta-icon">📅</span>
                    <p className="event-meta-text">
                      {formatDate(event.date)} • {event.time || "TBD"}
                    </p>
                  </div>

                  <div className="event-meta">
                    <span className="event-meta-icon">📍</span>
                    <p className="event-meta-text">{event.location}</p>
                  </div>

                  <div className="event-description">
                    {event.description || "No description available."}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;
