import { useState, useEffect } from "react";
import API from "../services/api";
import socket from "../services/socket";
import "./AdminDashboard.css";
import YogaExercisesTab from "../components/Admin/YogaExercisesTab";


function AdminDashboard() {
  const [pendingProviders, setPendingProviders] = useState([]);
  const [activeProviders, setActiveProviders] = useState([]);
  const [signupsByRole, setSignupsByRole] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [yogaExercises, setYogaExercises] = useState([]);


  useEffect(() => {
    fetchData();
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);

    // Socket listeners
    socket.on("providerActivated", (data) => {
      console.log("Socket providerActivated:", data);
      fetchData();
    });
    socket.on("bookingCreated", (data) => {
      console.log("Socket bookingCreated:", data);
      fetchData();
    });

    return () => {
      clearInterval(interval);
      socket.off("providerActivated");
      socket.off("bookingCreated");
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get pending providers
      const pendingRes = await API.get("/admin/pending-providers");
      setPendingProviders(pendingRes.data.providers || []);

      // Get active providers
      const activeRes = await API.get("/admin/active-providers");
      setActiveProviders(activeRes.data.providers || []);

      // Get signups by role
      const signupsRes = await API.get("/admin/signups");
      const signups = signupsRes.data.signups || [];
      
      // After signups fetch, add:
      const yogaRes = await API.get("/admin/yoga-exercises");
      setYogaExercises(yogaRes.data.exercises || []);


      // Group by role
      const grouped = {
        doctor: [],
        companion: [],
        nurse: []
      };
      
      signups.forEach(user => {
        if (grouped.hasOwnProperty(user.role)) {
          grouped[user.role].push(user);
        }
      });
      
      setSignupsByRole(grouped);
      
      console.log("Pending providers:", pendingRes.data);
      console.log("Active providers:", activeRes.data);
      console.log("Signups by role:", grouped);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      alert("Failed to load data. Please ensure you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateProvider = async (providerId) => {
    try {
      await API.put(`/admin/activate/${providerId}`);
      alert("Provider activated successfully! Email notification sent.");
      setConfirmAction(null);
      setSelectedProvider(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to activate provider");
    }
  };

  const handleDeactivateProvider = async (providerId) => {
    try {
      await API.put(`/admin/deactivate/${providerId}`);
      alert("Provider deactivated successfully.");
      setConfirmAction(null);
      setSelectedProvider(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to deactivate provider");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="container-fluid mt-4 mb-4">
      <h3 className="mb-4">
        <i className="bi bi-gear"></i> Admin Dashboard
      </h3>

      {loading && <div className="alert alert-info">Loading data...</div>}

      {/* Tab Navigation */}
      <div className="nav nav-tabs mb-4" role="tablist">
        <button
          className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
          role="tab"
        >
          <span className="badge bg-danger me-2">{pendingProviders.length}</span>
          Pending Activation
        </button>
        <button
          className={`nav-link ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
          role="tab"
        >
          <span className="badge bg-success me-2">{activeProviders.length}</span>
          Active Providers
        </button>
        <button
          className={`nav-link ${activeTab === "signups" ? "active" : ""}`}
          onClick={() => setActiveTab("signups")}
          role="tab"
        >
          <span className="badge bg-warning text-dark me-2">
            {(signupsByRole.doctor?.length || 0) + (signupsByRole.companion?.length || 0) + (signupsByRole.nurse?.length || 0)}
          </span>
          All Signups
        </button>

        <button
          className={`nav-link ${activeTab === "yoga" ? "active" : ""}`}
          onClick={() => setActiveTab("yoga")}
        >
        <span className="badge bg-info me-2">{yogaExercises.length}</span>
          Yoga Exercises
        </button>

      </div>

      {/* Pending Activation Tab */}
      {activeTab === "pending" && (
        <div className="ad-tab-content">
          <h5 className="mb-3">Providers Awaiting Activation</h5>
          {pendingProviders.length === 0 ? (
            <div className="alert alert-info">No pending providers.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Signup Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProviders.map((provider) => (
                    <tr key={provider._id}>
                      <td>
                        <strong>{provider.name}</strong>
                      </td>
                      <td>{provider.email}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {provider.role.charAt(0).toUpperCase() + provider.role.slice(1)}
                        </span>
                      </td>
                      <td>{formatDate(provider.createdAt)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              setSelectedProvider(provider);
                              setShowProfileModal(true);
                            }}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => {
                              setSelectedProvider(provider);
                              setConfirmAction("activate");
                            }}
                          >
                            <i className="bi bi-check-circle"></i> Activate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Active Providers Tab */}
      {activeTab === "active" && (
        <div className="ad-tab-content">
          <h5 className="mb-3">Active Providers</h5>
          {activeProviders.length === 0 ? (
            <div className="alert alert-info">No active providers yet.</div>
          ) : (
            <div className="row g-3">
              {activeProviders.map((provider) => (
                <div key={provider._id} className="col-md-6 col-lg-4">
                  <div className="card ad-provider-card">
                    <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">{provider.name}</h6>
                      <span className="badge bg-light text-dark">
                        {provider.role.charAt(0).toUpperCase() + provider.role.slice(1)}
                      </span>
                    </div>
                    <div className="card-body">
                      <p className="mb-2">
                        <strong>Email:</strong><br />
                        <small>{provider.email}</small>
                      </p>
                      <p className="mb-2">
                        <strong>Activated:</strong><br />
                        <small>{formatDate(provider.updatedAt)}</small>
                      </p>
                      <p className="mb-3">
                        <span className="badge bg-success">
                          <i className="bi bi-check-circle"></i> Active
                        </span>
                      </p>
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary mb-2"
                          onClick={() => {
                            setSelectedProvider(provider);
                            setShowProfileModal(true);
                          }}
                        >
                          View Profile
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger w-100"
                          onClick={() => {
                            setSelectedProvider(provider);
                            setConfirmAction("deactivate");
                          }}
                        >
                          <i className="bi bi-ban"></i> Deactivate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Signups Tab */}
      {activeTab === "signups" && (
        <div className="ad-tab-content">
          <h5 className="mb-3">All Signups by Role</h5>

          {/* Doctors Section */}
          <div className="mb-4">
            <h6 className="text-primary mb-3">
              <i className="bi bi-person-check"></i> Doctors ({signupsByRole.doctor?.length || 0})
            </h6>
            {signupsByRole.doctor?.length === 0 ? (
              <p className="text-muted">No doctor signups yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Signup Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signupsByRole.doctor?.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.isActive ? "bg-success" : "bg-warning text-dark"}`}>
                            {user.isActive ? "Active" : "Pending"}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Companions Section */}
          <div className="mb-4">
            <h6 className="text-success mb-3">
              <i className="bi bi-person-hands-raised"></i> Companions/Caregivers ({signupsByRole.companion?.length || 0})
            </h6>
            {signupsByRole.companion?.length === 0 ? (
              <p className="text-muted">No companion signups yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Signup Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signupsByRole.companion?.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.isActive ? "bg-success" : "bg-warning text-dark"}`}>
                            {user.isActive ? "Active" : "Pending"}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Nurses Section */}
          <div className="mb-4">
            <h6 className="text-danger mb-3">
              <i className="bi bi-hospital"></i> Nurses ({signupsByRole.nurse?.length || 0})
            </h6>
            {signupsByRole.nurse?.length === 0 ? (
              <p className="text-muted">No nurse signups yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Signup Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signupsByRole.nurse?.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.isActive ? "bg-success" : "bg-warning text-dark"}`}>
                            {user.isActive ? "Active" : "Pending"}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Yoga Exercises Tab  */}
      {activeTab === "yoga" && (
      <YogaExercisesTab 
       yogaExercises={yogaExercises} 
      onRefresh={fetchData} 
      />
      )}


      {/* Confirmation Modal */}
      {confirmAction && selectedProvider && (
        <div className="ad-modal-backdrop">
          <div className="ad-modal">
            <h5 className="modal-title mb-3">
              {confirmAction === "activate" ? "Activate Provider" : "Deactivate Provider"}
            </h5>
            <p className="text-muted">
              {confirmAction === "activate" ? (
                <>
                  You are about to <strong>activate</strong> <strong>{selectedProvider.name}</strong> ({selectedProvider.role}
                  ).
                  <br />
                  They will receive a notification email and can start accepting bookings.
                </>
              ) : (
                <>
                  You are about to <strong>deactivate</strong> <strong>{selectedProvider.name}</strong>. They will not be able to login or accept
                  bookings.
                </>
              )}
            </p>

            <div className="d-flex gap-2">
              <button
                className={`btn flex-grow-1 ${confirmAction === "activate" ? "btn-success" : "btn-danger"}`}
                onClick={() => {
                  if (confirmAction === "activate") {
                    handleActivateProvider(selectedProvider._id);
                  } else {
                    handleDeactivateProvider(selectedProvider._id);
                  }
                }}
              >
                {confirmAction === "activate" ? "Activate" : "Deactivate"}
              </button>
              <button
                className="btn btn-secondary flex-grow-1"
                onClick={() => {
                  setConfirmAction(null);
                  setSelectedProvider(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provider Profile Modal */}
      {showProfileModal && selectedProvider && (
        <div className="ad-modal-backdrop">
          <div className="ad-modal">
            <h5 className="modal-title mb-3">Provider Profile</h5>
            <p><strong>Name:</strong> {selectedProvider.name}</p>
            <p><strong>Email:</strong> {selectedProvider.email}</p>
            <p><strong>Role:</strong> {selectedProvider.role}</p>
            {selectedProvider.specialty && <p><strong>Specialty:</strong> {selectedProvider.specialty}</p>}
            {selectedProvider.experience && <p><strong>Experience:</strong> {selectedProvider.experience}</p>}
            {selectedProvider.certifications && <p><strong>Certifications:</strong> {selectedProvider.certifications}</p>}
            {selectedProvider.licenseNumber && <p><strong>License:</strong> {selectedProvider.licenseNumber}</p>}
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-primary flex-grow-1" onClick={() => { setShowProfileModal(false); setSelectedProvider(null); }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
