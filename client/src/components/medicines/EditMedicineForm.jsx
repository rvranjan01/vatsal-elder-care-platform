import { useEffect, useState } from "react";
import API from "../../services/api";

const buildInitialState = (medicine) => ({
  medicineName: medicine?.medicineName || "",
  medicineType: medicine?.medicineType || "tablet",
  dosage: medicine?.dosage || "",
  scheduleSlots: medicine?.scheduleSlots || [],
  startDate: medicine?.startDate
    ? new Date(medicine.startDate).toISOString().split("T")[0]
    : "",
  durationDays: medicine?.durationDays || "",
  currentStock: medicine?.currentStock ?? "",
  lowStockThreshold: medicine?.lowStockThreshold ?? 5,
  notes: medicine?.notes || "",
  status: medicine?.status || "active",
});

function EditMedicineForm({ show, medicine, onClose, onMedicineUpdated }) {
  const [formData, setFormData] = useState(buildInitialState(medicine));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (medicine) {
      setFormData(buildInitialState(medicine));
    }
  }, [medicine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "durationDays" ||
        name === "currentStock" ||
        name === "lowStockThreshold"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSlotChange = (slot) => {
    setFormData((prev) => ({
      ...prev,
      scheduleSlots: prev.scheduleSlots.includes(slot)
        ? prev.scheduleSlots.filter((item) => item !== slot)
        : [...prev.scheduleSlots, slot],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.scheduleSlots.length) {
      alert("Please select at least one schedule slot.");
      return;
    }

    try {
      setSubmitting(true);

      await API.patch(`/medicines/${medicine._id}`, {
        medicineName: formData.medicineName,
        medicineType: formData.medicineType,
        dosage: formData.dosage,
        scheduleSlots: formData.scheduleSlots,
        startDate: formData.startDate,
        durationDays: Number(formData.durationDays),
        currentStock: Number(formData.currentStock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        notes: formData.notes,
        status: formData.status,
      });

      onMedicineUpdated();
    } catch (error) {
      console.error("Error updating medicine:", error);
      alert(error?.response?.data?.message || "Failed to update medicine.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!show || !medicine) return null;

  return (
    <div className="medicine-modal-overlay">
      <div className="medicine-modal-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Edit Medicine</h4>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Medicine Name</label>
              <input
                type="text"
                name="medicineName"
                className="form-control"
                value={formData.medicineName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Medicine Type</label>
              <select
                name="medicineType"
                className="form-select"
                value={formData.medicineType}
                onChange={handleChange}
              >
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="injection">Injection</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Dosage</label>
              <input
                type="text"
                name="dosage"
                className="form-control"
                placeholder="e.g. 1 after food"
                value={formData.dosage}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Duration (days)</label>
              <input
                type="number"
                name="durationDays"
                className="form-control"
                min="1"
                value={formData.durationDays}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="form-control"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Current Stock</label>
              <input
                type="number"
                name="currentStock"
                className="form-control"
                min="0"
                value={formData.currentStock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Low Stock Threshold</label>
              <input
                type="number"
                name="lowStockThreshold"
                className="form-control"
                min="1"
                value={formData.lowStockThreshold}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label d-block">Schedule Slots</label>
              <div className="d-flex gap-3 flex-wrap mt-2">
                {["Morning", "Afternoon", "Night"].map((slot) => (
                  <div className="form-check" key={slot}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`edit-${slot}`}
                      checked={formData.scheduleSlots.includes(slot)}
                      onChange={() => handleSlotChange(slot)}
                    />
                    <label className="form-check-label" htmlFor={`edit-${slot}`}>
                      {slot}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                rows="3"
                className="form-control"
                placeholder="Before food / after food / special instructions"
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Updating..." : "Update Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMedicineForm;