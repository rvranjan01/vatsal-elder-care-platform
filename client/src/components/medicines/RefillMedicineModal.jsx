import { useState } from "react";
import API from "../../services/api";

function RefillMedicineModal({ show, medicine, onClose, onRefillDone }) {
  const [refillQuantity, setRefillQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRefill = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.patch(`/medicines/${medicine._id}/refill`, {
        refillQuantity: Number(refillQuantity),
      });

      setRefillQuantity("");
      onRefillDone();
    } catch (error) {
      console.error("Error refilling medicine:", error);
      alert(error?.response?.data?.message || "Failed to refill stock.");
    } finally {
      setLoading(false);
    }
  };

  if (!show || !medicine) return null;

  return (
    <div className="medicine-modal-overlay">
      <div className="medicine-modal-card small-modal">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Refill Stock</h4>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          ></button>
        </div>

        <p className="text-muted">
          <strong>{medicine.medicineName}</strong> current stock:{" "}
          {medicine.currentStock}/{medicine.initialStock}
        </p>

        <form onSubmit={handleRefill}>
          <label className="form-label">Add Quantity</label>
          <input
            type="number"
            min="1"
            className="form-control"
            value={refillQuantity}
            onChange={(e) => setRefillQuantity(e.target.value)}
            required
          />

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? "Updating..." : "Refill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RefillMedicineModal;
