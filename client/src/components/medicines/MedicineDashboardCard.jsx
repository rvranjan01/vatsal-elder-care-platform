import { Link } from "react-router-dom";

function MedicineDashboardCard({ medicines = [] }) {
  const activeMedicines = medicines.slice(0, 4);

  return (
    <div className="dashboard-section medicine-reminders">
      <div className="section-header">
        <h3>💊 Medicine Reminders</h3>
        <span className="section-badge">{medicines.length} medications</span>
      </div>

      {activeMedicines.length > 0 ? (
        <div className="reminder-list">
          {activeMedicines.map((med) => (
            <div key={med._id} className="reminder-item">
              <div className="reminder-icon">💊</div>
              <div className="reminder-content">
                <p className="reminder-name">{med.medicineName}</p>
                <p className="reminder-time">
                  {(med.scheduleSlots || []).join(", ")} • Stock: {med.currentStock}/{med.initialStock}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">No medicines scheduled.</p>
      )}

      <Link to="/medicines" className="view-more-btn">View All →</Link>
    </div>
  );
}

export default MedicineDashboardCard;