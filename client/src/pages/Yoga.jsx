import { useState, useEffect } from "react";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Yoga.css";

function Yoga() {
  const [yogaExercises, setYogaExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [completedSessions, setCompletedSessions] = useState([]);

  const [sessionForm, setSessionForm] = useState({
    exerciseTitle: "",
    date: new Date().toISOString().split("T")[0],
    duration: "",
    notes: "",
  });

  // Admin: add new yoga pose
  const [newPose, setNewPose] = useState({
    title: "",
    description: "",
    duration: "",
    benefits: "",
  });

  const role = localStorage.getItem("role");

  // Fallback poses if DB is empty
  const defaultPoses = [
    {
      _id: "pose1",
      title: "🧘 Tadasana (Mountain Pose)",
      description:
        "Stand with feet hip-width apart. Press all four corners of your feet into the ground. Lengthen your spine, relax your shoulders, and let your arms hang at your sides with palms facing forward.",
      duration: "5-10 mins",
      benefits:
        "Improves posture, strengthens legs, reduces anxiety, increases balance and body awareness. Great for core stability.",
    },
    {
      _id: "pose2",
      title: "🙏 Bhujangasana (Cobra Pose)",
      description:
        "Lie on your stomach with legs extended. Place hands under shoulders. Press into your hands and lift your chest off the ground. Keep your elbows close to your ribs. Hold and breathe deeply.",
      duration: "3-5 mins",
      benefits:
        "Strengthens the back, stretches chest and shoulders, improves flexibility, and opens the heart. Aids digestion.",
    },
    {
      _id: "pose3",
      title: "🌳 Vrksasana (Tree Pose)",
      description:
        "Stand on one leg. Place the sole of your other foot on your inner thigh (or calf if you're just starting). Bring your palms together in front of your heart or raise them overhead. Balance for 30 seconds each side.",
      duration: "2-5 mins",
      benefits:
        "Enhances balance, strengthens legs and core, improves focus and concentration, calms the mind.",
    },
    {
      _id: "pose4",
      title: "🌬️ Ardha Matsyendrasana (Seated Spinal Twist)",
      description:
        "Sit with legs extended. Bend one knee and place that foot outside the opposite leg. Twist gently towards the bent knee. Hold for 20-30 seconds. Repeat on the other side.",
      duration: "3-5 mins",
      benefits:
        "Stretches spine and back muscles, improves digestion, reduces lower back tension, and increases spinal mobility.",
    },
    {
      _id: "pose5",
      title: "🌸 Balasana (Child's Pose)",
      description:
        "Kneel on the floor. Bring your big toes together and spread your knees apart. Fold forward and rest your forehead on a pillow if needed. Let your arms relax naturally.",
      duration: "5-10 mins",
      benefits:
        "Calms the nervous system, stretches the back, reduces stress and anxiety. Great for relaxation and recovery.",
    },
    {
      _id: "pose6",
      title: "⬆️ Adho Mukha Svanasana (Downward Dog)",
      description:
        "Start on hands and knees. Spread fingers wide and press palms into the ground. Curl your toes under and lift your hips high. Head should hang freely between your arms. Hold for 5-10 breaths.",
      duration: "5-15 mins",
      benefits:
        "Strengthens arms and shoulders, stretches hamstrings and calves, improves blood circulation, and calms the mind.",
    },
  ];

  const displayExercises =
    yogaExercises.length > 0 ? yogaExercises : defaultPoses;

  useEffect(() => {
    fetchYogaExercises();
    loadCompletedSessions();
  }, []);

  // Fetch list of poses from backend
  const fetchYogaExercises = async () => {
    try {
      setLoading(true);
      // const res = await API.get("/yoga/list");
      const res = await API.get("/yoga/list");
      const list = res.data || res || []; // Handle both response formats
      setYogaExercises(list);
      // const list = res.data || [];
      setYogaExercises(list);
      if (list.length > 0) {
        setSelectedExercise(list[0]);
      } else {
        // if DB empty, use first default as selected
        setSelectedExercise(defaultPoses[0]);
      }
    } catch (err) {
      console.error("Error fetching yoga exercises:", err);
      alert("Failed to load yoga exercises, using default poses");
      // fallback: default poses
      setSelectedExercise(defaultPoses[0]);
    } finally {
      setLoading(false);
    }
  };

  // Load completed sessions (backend first, then localStorage fallback)
  const loadCompletedSessions = async () => {
    try {
      const response = await API.get("/yoga/my-sessions");
      const backendSessions = response.data.map((session) => ({
        id: session._id,
        exerciseTitle: session.exerciseTitle,
        exerciseId: session.exerciseId,
        date: session.date,
        duration: session.duration,
        notes: session.notes,
      }));
      setCompletedSessions(backendSessions);
    } catch (err) {
      console.log("Backend sessions unavailable, loading from localStorage");
      const sessions = JSON.parse(localStorage.getItem("yogaSessions")) || [];
      setCompletedSessions(sessions);
    }
  };

  // Elder: complete a yoga session
  const handleCompleteSession = async () => {
    if (!selectedExercise) {
      alert("Please select an exercise first");
      return;
    }

    const sessionData = {
      // may be undefined for default poses; backend will ignore non-ObjectId
      exerciseId: selectedExercise._id,
      exerciseTitle: selectedExercise.title,
      date: sessionForm.date,
      duration: sessionForm.duration || selectedExercise.duration || "30 mins",
      notes: sessionForm.notes,
    };

    try {
      const response = await API.post("/yoga/log-session", sessionData);
      console.log("Session saved to backend:", response.data);

      const localSession = {
        id: Date.now(),
        ...sessionData,
        date: new Date().toLocaleString(),
      };
      const updated = [localSession, ...completedSessions];
      setCompletedSessions(updated);
      localStorage.setItem("yogaSessions", JSON.stringify(updated));

      alert("Great! Session recorded in cloud! 🧘");
      setSessionForm({
        exerciseTitle: "",
        date: new Date().toISOString().split("T")[0],
        duration: "",
        notes: "",
      });
    } catch (err) {
      console.error("Backend save failed:", err);

      const localSession = {
        id: Date.now(),
        exerciseTitle: selectedExercise.title,
        exerciseId: selectedExercise._id,
        date: new Date().toLocaleString(),
        duration:
          sessionForm.duration || selectedExercise.duration || "30 mins",
        notes: sessionForm.notes,
      };
      const updated = [localSession, ...completedSessions];
      setCompletedSessions(updated);
      localStorage.setItem("yogaSessions", JSON.stringify(updated));

      alert("Saved locally (no internet). Session logged offline! 📱");
    }
  };

  // Delete local session (doesn't touch backend)
  const deleteSession = (id) => {
    if (!window.confirm("Delete this session?")) return;
    const updated = completedSessions.filter((s) => s.id !== id);
    setCompletedSessions(updated);
    localStorage.setItem("yogaSessions", JSON.stringify(updated));
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Helper function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    // Match patterns: https://youtu.be/VIDEO_ID or https://www.youtube.com/watch?v=VIDEO_ID
    const patterns = [
      /youtu\.be\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    ];

    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Admin: add new yoga pose to backend
  const handleAddPose = async (e) => {
    e.preventDefault();

    if (!newPose.title || !newPose.description) {
      alert("Title and description are required");
      return;
    }

    try {
      const res = await API.post("/yoga/add", newPose);
      const created = res.data.yoga;

      setYogaExercises((prev) => [created, ...prev]);

      if (!selectedExercise || yogaExercises.length === 0) {
        setSelectedExercise(created);
      }

      setNewPose({
        title: "",
        description: "",
        duration: "",
        benefits: "",
      });

      alert("Yoga pose added to backend successfully");
    } catch (err) {
      console.error("Error adding yoga pose:", err);
      alert("Failed to add yoga pose");
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading yoga exercises...</p>
      </div>
    );
  }

  return (
    <div className="yoga-page">
      <div className="yoga-header">
        <h1 className="text-center mb-2">🧘 Yoga for Elder Wellness</h1>
        <p className="text-center text-muted mb-4">
          Guided yoga poses designed for flexibility, strength, and peace of
          mind
        </p>
      </div>

      {/* Admin: Add New Pose */}
      {role === "admin" && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">➕ Add New Yoga Pose</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddPose}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newPose.title}
                      onChange={(e) =>
                        setNewPose({ ...newPose, title: e.target.value })
                      }
                      placeholder="e.g. Tadasana (Mountain Pose)"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newPose.description}
                      onChange={(e) =>
                        setNewPose({
                          ...newPose,
                          description: e.target.value,
                        })
                      }
                      placeholder="How to perform the pose..."
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newPose.duration}
                      onChange={(e) =>
                        setNewPose({ ...newPose, duration: e.target.value })
                      }
                      placeholder="e.g. 5-10 mins"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Benefits</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={newPose.benefits}
                      onChange={(e) =>
                        setNewPose({ ...newPose, benefits: e.target.value })
                      }
                      placeholder="Key benefits of this pose..."
                    />
                  </div>

                  <button type="submit" className="btn btn-secondary">
                    Save Pose
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        {/* Exercise List */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">📋 Yoga Poses</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {displayExercises.map((ex, idx) => (
                  <button
                    key={ex._id || idx}
                    className={`list-group-item list-group-item-action text-start ${
                      selectedExercise?._id === ex._id ||
                      (idx === 0 && !selectedExercise)
                        ? "active bg-success"
                        : ""
                    }`}
                    onClick={() => setSelectedExercise(ex)}
                  >
                    <strong>{ex.title}</strong>
                    <p className="small mb-0 mt-1 text-muted">
                      ⏱️ {ex.duration}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Details & Session Log */}
        <div className="col-lg-8">
          {selectedExercise && (
            <>
              {/* Exercise Details - Split Layout */}
              <div className="card shadow-sm mb-4 yoga-details-card">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">{selectedExercise.title}</h5>
                </div>
                <div className="card-body">
                  <div className="yoga-details-container">
                    {/* Left Side - Video */}
                    <div className="yoga-video-section">
                      {selectedExercise.videoUrl ? (
                        <div className="yoga-video-wrapper">
                          <iframe
                            width="100%"
                            height="400"
                            src={
                              selectedExercise.videoUrl.includes(
                                "youtube.com/embed/",
                              )
                                ? selectedExercise.videoUrl
                                : `https://www.youtube.com/embed/${getYouTubeVideoId(selectedExercise.videoUrl)}`
                            }
                            title={selectedExercise.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <div className="yoga-no-video">
                          <p className="text-muted text-center">
                            📹 No video available for this pose
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Side - Details */}
                    <div className="yoga-info-section">
                      <div className="yoga-info-item">
                        <h6 className="yoga-info-label">⏱️ Duration</h6>
                        <p className="yoga-info-value">
                          {selectedExercise.duration}
                        </p>
                      </div>

                      <div className="yoga-info-item">
                        <h6 className="yoga-info-label">💪 Difficulty</h6>
                        <p className="yoga-info-value">
                          <span
                            className={`badge ${
                              selectedExercise.difficulty === "beginner"
                                ? "bg-success"
                                : selectedExercise.difficulty === "intermediate"
                                  ? "bg-warning text-dark"
                                  : "bg-danger"
                            }`}
                          >
                            {selectedExercise.difficulty?.toUpperCase() ||
                              "N/A"}
                          </span>
                        </p>
                      </div>

                      <div className="yoga-info-item">
                        <h6 className="yoga-info-label">📚 Category</h6>
                        <p className="yoga-info-value">
                          {selectedExercise.category || "General"}
                        </p>
                      </div>

                      <div className="yoga-info-item">
                        <h6 className="yoga-info-label">✨ Benefits</h6>
                        <p className="yoga-info-value text-small">
                          {Array.isArray(selectedExercise.benefits)
                            ? selectedExercise.benefits.join(", ")
                            : selectedExercise.benefits}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* How to Do It - Below Video and Details */}
                  <div className="yoga-instructions-section">
                    <h6 className="yoga-instructions-label">📖 How to Do It</h6>
                    <p className="yoga-description">
                      {selectedExercise.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Complete Session Form */}
              {role === "elder" && (
                <div className="card shadow-sm mb-4 border-success">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">✅ Log Your Session</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={sessionForm.date}
                          onChange={(e) =>
                            setSessionForm({
                              ...sessionForm,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Duration</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. 30 mins"
                          value={sessionForm.duration}
                          onChange={(e) =>
                            setSessionForm({
                              ...sessionForm,
                              duration: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        placeholder="How did you feel? Any difficulty?"
                        value={sessionForm.notes}
                        onChange={(e) =>
                          setSessionForm({
                            ...sessionForm,
                            notes: e.target.value,
                          })
                        }
                        rows="3"
                      />
                    </div>
                    <button
                      className="btn btn-success"
                      onClick={handleCompleteSession}
                    >
                      Mark as Completed
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Completed Sessions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                📊 Your Yoga Journey ({completedSessions.length} sessions)
              </h5>
            </div>
            <div className="card-body">
              {completedSessions.length === 0 ? (
                <p className="text-muted text-center">
                  Start your yoga journey by completing your first session! 🙏
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead className="table-light">
                      <tr>
                        <th>Exercise</th>
                        <th>Date & Time</th>
                        <th>Duration</th>
                        <th>Notes</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedSessions.map((session) => (
                        <tr key={session.id}>
                          <td>{session.exerciseTitle}</td>
                          <td>{formatDate(session.date)}</td>
                          <td>{session.duration}</td>
                          <td>{session.notes || "-"}</td>
                          <td>
                            {role === "elder" && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => deleteSession(session.id)}
                              >
                                Delete
                              </button>
                            )}
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

      {/* Tips Section */}
      <div className="row mt-5">
        <div className="col-md-6">
          <div className="card border-warning">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">⚠️ Safety Tips</h5>
            </div>
            <div className="card-body">
              <ul>
                <li>Start slowly and listen to your body</li>
                <li>Never push into pain—yoga should feel good</li>
                <li>Breathe steadily throughout all poses</li>
                <li>Use a yoga mat or soft surface</li>
                <li>Warm up before starting your practice</li>
                <li>Consult your doctor if you have health concerns</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-info">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">💡 Best Practices</h5>
            </div>
            <div className="card-body">
              <ul>
                <li>Practice 3-4 times a week for best results</li>
                <li>Choose a quiet, peaceful space</li>
                <li>Wear comfortable, loose clothing</li>
                <li>Practice on an empty stomach or 2-3 hours after meals</li>
                <li>End with meditation or deep breathing (5-10 mins)</li>
                <li>Consistency is key to seeing benefits</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Yoga;
