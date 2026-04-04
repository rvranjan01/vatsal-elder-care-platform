import React, { useState } from "react";
import API from "../../services/api";
import LocalEventModal from "./LocalEventModal";

const LocalEventsTab = ({ localEvents, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Delete this event?")) {
      try {
        await API.delete(`/admin/local-events/${eventId}`);
        onRefresh();
      } catch (err) {
        alert("Failed to delete event");
      }
    }
  };

  return (
    <div className="ad-tab-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>
          Local Events{" "}
          <span className="badge bg-primary">{localEvents.length}</span>
        </h5>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingEvent(null);
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus"></i> Add Event
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localEvents.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No local events found
                </td>
              </tr>
            ) : (
              localEvents.map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.location}</td>
                  <td>
                    <span
                      className={`badge ${
                        event.type === "health"
                          ? "bg-danger"
                          : event.type === "social"
                            ? "bg-info"
                            : event.type === "creative"
                              ? "bg-warning text-dark"
                              : "bg-success"
                      }`}
                    >
                      {event.type?.charAt(0).toUpperCase() +
                        event.type?.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(event)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(event._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <LocalEventModal
          event={editingEvent}
          onClose={() => {
            setShowModal(false);
            setEditingEvent(null);
          }}
          onSave={onRefresh}
        />
      )}
    </div>
  );
};

export default LocalEventsTab;
