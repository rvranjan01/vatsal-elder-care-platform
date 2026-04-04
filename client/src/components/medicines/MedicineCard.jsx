function MedicineCard({
  medicine,
  onViewHistory,
  onEdit,
  onRefill,
  onTake,
  onSkip,
  onDelete,
}) {
  const {
    _id,
    medicineName,
    medicineType,
    dosage,
    scheduleSlots = [],
    startDate,
    endDate,
    durationDays,
    currentStock,
    initialStock,
    lowStockThreshold,
    notes,
    status,
    todayStatus = {},
  } = medicine;

  const isLowStock = Number(currentStock) <= Number(lowStockThreshold || 5);

  const getTypeBadgeClass = () => {
    if (medicineType === "tablet") return "bg-primary-subtle text-primary";
    if (medicineType === "capsule") return "bg-info-subtle text-info";
    return "bg-warning-subtle text-dark";
  };

  const getSlotStatusClass = (slotStatus) => {
    if (slotStatus === "taken") return "slot-taken";
    if (slotStatus === "skipped") return "slot-skipped";
    if (slotStatus === "missed") return "slot-missed";
    return "slot-pending";
  };

  const getDaysLeft = () => {
    if (!currentStock || !scheduleSlots.length) return 0;
    return Math.floor(Number(currentStock) / scheduleSlots.length);
  };

  return (
    <div className="card border-0 shadow-sm medicine-card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h5 className="mb-0">{medicineName}</h5>
              <span className={`badge ${getTypeBadgeClass()}`}>
                {medicineType}
              </span>
              <span className="badge bg-secondary-subtle text-dark text-capitalize">
                {status}
              </span>
              {isLowStock && (
                <span className="badge bg-danger-subtle text-danger">
                  Low Stock
                </span>
              )}
            </div>

            <p className="text-muted mb-2 mt-2">
              {dosage} • {durationDays} days
            </p>

            <div className="medicine-meta">
              <span>
                Start:{" "}
                {startDate ? new Date(startDate).toLocaleDateString() : "N/A"}
              </span>
              <span>
                End: {endDate ? new Date(endDate).toLocaleDateString() : "N/A"}
              </span>
              <span>Slots: {scheduleSlots.join(", ") || "N/A"}</span>
              <span>
                Stock: {currentStock}/{initialStock}
              </span>
              <span>Days Left: {getDaysLeft()}</span>
            </div>

            {notes && <p className="medicine-notes mt-2 mb-0">{notes}</p>}
          </div>

          <div className="text-end">
            <div className={`stock-pill ${isLowStock ? "low" : ""}`}>
              {currentStock}/{initialStock}
            </div>
            <small className="text-muted d-block mt-1">
              Threshold: {lowStockThreshold || 5}
            </small>
          </div>
        </div>

        <hr />

        <div className="slot-section">
          <p className="slot-title mb-2">Today’s Slots</p>
          <div className="row g-2">
            {scheduleSlots.map((slot) => {
              const slotStatus = todayStatus[slot] || "pending";

              return (
                <div className="col-md-4" key={slot}>
                  <div
                    className={`slot-card ${getSlotStatusClass(slotStatus)}`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong>{slot}</strong>
                      <span className="slot-status-text text-capitalize">
                        {slotStatus}
                      </span>
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        className="btn btn-success btn-sm"
                        disabled={
                          slotStatus === "taken" || Number(currentStock) <= 0
                        }
                        onClick={() => onTake(_id, slot)}
                      >
                        Take
                      </button>

                      <button
                        className="btn btn-outline-secondary btn-sm"
                        disabled={slotStatus === "taken"}
                        onClick={() => onSkip(_id, slot)}
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap mt-3">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => onViewHistory(medicine)}
          >
            View History
          </button>

          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => onEdit(medicine)}
          >
            Edit
          </button>

          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => onRefill(medicine)}
          >
            Refill Stock
          </button>
          <button className="btn btn-delete" onClick={() => onDelete(medicine)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedicineCard;
