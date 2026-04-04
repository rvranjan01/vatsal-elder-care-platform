import React, { useState, useEffect } from "react";
import API from "../../services/api";

const LocalEventModal = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    type: "health",
    organizer: "",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        date: event.date
          ? new Date(event.date).toISOString().split("T")[0]
          : "",
        time: event.time || "",
        location: event.location || "",
        description: event.description || "",
        type: event.type || "health",
        organizer: event.organizer || "",
      });
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (event) {
        await API.put(`/admin/local-events/${event._id}`, formData);
      } else {
        await API.post("/admin/local-events", formData);
      }
      onSave();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save event");
    }
  };

  return (
    <div className="ad-modal-backdrop" onClick={onClose}>
      <div
        className="ad-modal"
        style={{ maxWidth: "600px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h5>{event ? "Edit Event" : "Add New Event"}</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-control"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Time</label>
              <input
                type="time"
                className="form-control"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Location *</label>
            <input
              type="text"
              className="form-control"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g. Bengaluru Community Center"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Type *</label>
            <select
              className="form-select"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="health">Health</option>
              <option value="social">Social</option>
              <option value="creative">Creative</option>
              <option value="wellness">Wellness</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Event description..."
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Organizer</label>
            <input
              type="text"
              className="form-control"
              value={formData.organizer}
              onChange={(e) =>
                setFormData({ ...formData, organizer: e.target.value })
              }
              placeholder="e.g. Local NGO"
            />
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-success flex-grow-1">
              {event ? "Update Event" : "Add Event"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocalEventModal;
