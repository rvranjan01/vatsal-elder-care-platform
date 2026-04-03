function MedicineFilters({ filters, setFilters }) {
  return (
    <div className="card shadow-sm border-0 mb-3 medicine-filter-card">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search medicine..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <option value="all">All</option>
              <option value="tablet">Tablet</option>
              <option value="capsule">Capsule</option>
              <option value="injection">Injection</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Slot</label>
            <select
              className="form-select"
              value={filters.slot}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, slot: e.target.value }))
              }
            >
              <option value="all">All</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Night">Night</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineFilters;