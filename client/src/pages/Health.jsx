import { useState, useEffect } from "react";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Health.css";

function Health() {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  const [formData, setFormData] = useState({
    bloodPressure: "",
    sugarLevel: "",
    notes: "",
  });

  const [elders, setElders] = useState([]);
  const [selectedElder, setSelectedElder] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "family") {
      fetchProfileAndHealth();
    } else {
      fetchHealth();
    }
  }, []);

  const fetchProfileAndHealth = async () => {
    try {
      setLoading(true);
      const res = await API.get("/auth/me");
      const user = res.data.user;
      const linked =
        user.elderIds && Array.isArray(user.elderIds) ? user.elderIds : [];
      setElders(linked);
      if (linked.length > 0) {
        const id = linked[0]._id || linked[0].id;
        setSelectedElder(id);
        await fetchHealth(id);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      alert("Unable to load linked elders");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorNotes = async (elderId) => {
    try {
      setLoadingNotes(true);
      const res = await API.get("/doctors/notes");
      setDoctorNotes(res.data.notes || []);
    } catch (err) {
      console.error("Error fetching doctor notes:", err);
      setDoctorNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  };

  const fetchHealth = async (elderId) => {
    try {
      setLoading(true);
      let url = "/health/list";
      if (elderId) url += `?elderId=${elderId}`;
      const res = await API.get(url);
      setHealthData(res.data || []);

      // Fetch doctor notes for elder or family
      if (role === "elder" || role === "family") {
        await fetchDoctorNotes(elderId);
      }
    } catch (err) {
      console.error("Error fetching health data:", err);
      alert("Failed to load health data");
    } finally {
      setLoading(false);
    }
  };

  const handleElderChange = async (e) => {
    const id = e.target.value;
    setSelectedElder(id);
    await fetchHealth(id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bloodPressure || !formData.sugarLevel) {
      alert("Please provide both blood pressure and sugar level");
      return;
    }
    try {
      setIsSubmitting(true);
      // Include elderId for family members
      const payload =
        role === "family" ? { ...formData, elderId: selectedElder } : formData;
      await API.post("/health/add", payload);
      alert("Health record added successfully");
      setFormData({ bloodPressure: "", sugarLevel: "", notes: "" });
      fetchHealth(selectedElder);
    } catch (err) {
      console.error("Error adding health record:", err);
      alert(err.response?.data?.message || "Failed to add record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return "-";
    }
  };

  return (
    <div className="health-page">
      <h2 className="mb-4">Health Records</h2>

      {/* elder selector for family users */}
      {role === "family" && elders.length > 0 && (
        <div className="mb-3">
          <label className="form-label me-2">
            <strong>Select Elder:</strong>
          </label>
          <select
            className="form-select w-auto d-inline"
            value={selectedElder}
            onChange={handleElderChange}
          >
            <option value="">-- choose --</option>
            {elders.map((e) => {
              const id = e._id || e.id;
              const name = e.name || e.username || "Unknown";
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* form available to elders and family members */}
      {(role === "elder" || (role === "family" && selectedElder)) && (
        <div className="card shadow mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Add Health Data</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Blood Pressure *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleInputChange}
                    placeholder="e.g. 120/80"
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Sugar Level *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="sugarLevel"
                    value={formData.sugarLevel}
                    onChange={handleInputChange}
                    placeholder="e.g. 90 mg/dL"
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Notes</label>
                  <input
                    type="text"
                    className="form-control"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional remarks"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Add Record"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* list of records */}
      <div className="card shadow">
        <div className="card-body">
          {loading ? (
            <p>Loading health data...</p>
          ) : healthData.length === 0 ? (
            <p className="text-muted">No health records available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Blood Pressure</th>
                    <th>Sugar Level</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {healthData.map((h) => (
                    <tr key={h._id || h.id}>
                      <td>{formatDate(h.createdAt)}</td>
                      <td>{h.bloodPressure || "-"}</td>
                      <td>{h.sugarLevel || "-"}</td>
                      <td>{h.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Health;
