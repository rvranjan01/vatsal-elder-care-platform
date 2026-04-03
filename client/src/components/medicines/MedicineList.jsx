import MedicineCard from "./MedicineCard";

function MedicineList({
  medicines,
  loading,
  onTakeSlot,
  onSkipSlot,
  onViewHistory,
  onEdit,
  onRefill,
}) {
  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <p className="mb-0">Loading medicines...</p>
        </div>
      </div>
    );
  }

  if (!medicines.length) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <h5>No medicines found</h5>
          <p className="text-muted mb-0">
            Add a medicine to start tracking schedule, stock, and reminders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="medicine-list-wrap">
      {medicines.map((medicine) => (
        <MedicineCard
          key={medicine._id}
          medicine={medicine}
          onTakeSlot={onTakeSlot}
          onSkipSlot={onSkipSlot}
          onViewHistory={onViewHistory}
          onEdit={onEdit}
          onRefill={onRefill}
        />
      ))}
    </div>
  );
}

export default MedicineList;