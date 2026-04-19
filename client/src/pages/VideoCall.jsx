import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

function VideoCall() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await API.get(`/bookings/${id}`);
        setBooking(res.data.booking);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError(
          err.response?.data?.message ||
            "Unable to retrieve video call booking",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const getMeetingUrl = () => {
    if (booking?.videoCallLink) {
      return booking.videoCallLink;
    }
    if (booking?.consultationType === "Video Call") {
      return `https://meet.jit.si/elder-care-${booking._id}`;
    }
    return null;
  };

  const meetingUrl = getMeetingUrl();

  const handleJoin = () => {
    setJoined(true);
  };

  if (loading) {
    return <div className="container mt-4">Loading video call details...</div>;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <p className="text-danger">{error}</p>
        <Link to="/booking" className="btn btn-secondary">
          Back to bookings
        </Link>
      </div>
    );
  }

  if (!booking || !meetingUrl) {
    return (
      <div className="container mt-4">
        <h2>Video Call Not Available</h2>
        <p>
          This booking is not configured for video consultation. Please check
          the booking details or contact the provider.
        </p>
        <Link to="/booking" className="btn btn-secondary">
          Back to bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="mb-3">Video Consultation</h2>
          <p>
            <strong>Doctor:</strong> {booking.doctorName}
          </p>
          <p>
            <strong>Patient:</strong> {booking.elderName}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(booking.appointmentDate).toLocaleString()}
          </p>
          <p>
            <strong>Meeting Room:</strong> {meetingUrl}
          </p>
          <div className="mb-3">
            <button
              className="btn btn-primary me-2"
              onClick={handleJoin}
              disabled={joined}
            >
              {joined ? "Meeting Loaded" : "Join Video Call"}
            </button>
            <a
              href={meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-primary me-2"
            >
              Open in New Tab
            </a>
            <Link to="/booking" className="btn btn-secondary">
              Back to Bookings
            </Link>
          </div>
          {joined ? (
            <div style={{ width: "100%", height: "75vh" }}>
              <iframe
                title="Jitsi Video Call"
                src={meetingUrl}
                allow="camera; microphone; fullscreen; display-capture"
                style={{ width: "100%", height: "100%", border: "0" }}
              />
            </div>
          ) : (
            <div className="alert alert-info">
              Click "Join Video Call" when you are ready. The meeting will load
              in the embedded player.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoCall;
