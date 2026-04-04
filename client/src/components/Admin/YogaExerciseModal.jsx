import React, { useState, useEffect } from "react";
import API from "../../services/api";

const YogaExerciseModal = ({ exercise, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    difficulty: "beginner",
    category: "stretching",
    benefits: "",
    instructions: "",
  });

  useEffect(() => {
    if (exercise) {
      setFormData({
        title: exercise.title || "",
        description: exercise.description || "",
        duration: exercise.duration || "",
        difficulty: exercise.difficulty || "beginner",
        category: exercise.category || "stretching",
        benefits: exercise.benefits?.join(", ") || "",
        instructions: exercise.instructions?.join(", ") || "",
      });
    }
  }, [exercise]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (exercise) {
        await API.put(`/admin/yoga-exercises/${exercise._id}`, formData);
      } else {
        await API.post("/admin/yoga-exercises", formData);
      }
      onSave();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save exercise");
    }
  };

  return (
    <div className="ad-modal-backdrop" onClick={onClose}>
      <div
        className="ad-modal"
        style={{ maxWidth: "600px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h5>{exercise ? "Edit Exercise" : "Add New Exercise"}</h5>
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

          <div className="mb-3">
            <label className="form-label">Description *</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Duration (min) *</label>
              <input
                type="number"
                className="form-control"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                min="1"
                max="60"
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Difficulty *</label>
              <select
                className="form-select"
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value })
                }
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="stretching">Stretching</option>
                <option value="strength">Strength</option>
                <option value="breathing">Breathing</option>
                <option value="balance">Balance</option>
                <option value="relaxation">Relaxation</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Benefits (comma separated)</label>
            <input
              type="text"
              className="form-control"
              value={formData.benefits}
              onChange={(e) =>
                setFormData({ ...formData, benefits: e.target.value })
              }
              placeholder="improves flexibility, reduces stress, better posture"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Instructions (comma separated)</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              placeholder="Inhale deeply, Hold for 5 seconds, Exhale slowly"
            />
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-success flex-grow-1">
              {exercise ? "Update Exercise" : "Add Exercise"}
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

export default YogaExerciseModal;
