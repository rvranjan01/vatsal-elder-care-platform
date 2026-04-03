import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import AddMedicineForm from "../components/medicines/AddMedicineForm";
import EditMedicineForm from "../components/medicines/EditMedicineForm";
import MedicineFilters from "../components/medicines/MedicineFilters";
import MedicineList from "../components/medicines/MedicineList";
import RefillMedicineModal from "../components/medicines/RefillMedicineModal";
import MedicineHistory from "../components/medicines/MedicineHistory";
import "../styles/Medicines.css";

function MedicinesPage() {
  const [medicines, setMedicines] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showRefillModal, setShowRefillModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    status: "all",
    slot: "all",
  });

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await API.get("/medicines/list");
      setMedicines(res.data.medicines || []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicineHistory = async (medicineId) => {
    try {
      setHistoryLoading(true);
      const res = await API.get(`/medicines/${medicineId}/history`);
      setHistory(res.data.history || []);
    } catch (error) {
      console.error("Error fetching medicine history:", error);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleMedicineAdded = async () => {
    setShowAddForm(false);
    await fetchMedicines();
  };

  const handleMedicineUpdated = async () => {
    setShowEditForm(false);
    await fetchMedicines();

    if (selectedMedicine?._id) {
      await fetchMedicineHistory(selectedMedicine._id);
    }
  };

  const handleRefillDone = async () => {
    setShowRefillModal(false);
    await fetchMedicines();

    if (selectedMedicine?._id) {
      await fetchMedicineHistory(selectedMedicine._id);
    }
  };

  const handleTakeSlot = async (medicineId, slot) => {
    try {
      await API.patch(`/medicines/${medicineId}/take`, { slot });
      await fetchMedicines();

      if (selectedMedicine?._id === medicineId) {
        await fetchMedicineHistory(medicineId);
      }
    } catch (error) {
      console.error("Error marking medicine as taken:", error);
      alert(error?.response?.data?.message || "Failed to mark medicine as taken.");
    }
  };

  const handleSkipSlot = async (medicineId, slot) => {
    try {
      await API.patch(`/medicines/${medicineId}/skip`, { slot });
      await fetchMedicines();

      if (selectedMedicine?._id === medicineId) {
        await fetchMedicineHistory(medicineId);
      }
    } catch (error) {
      console.error("Error skipping medicine slot:", error);
      alert(error?.response?.data?.message || "Failed to skip medicine slot.");
    }
  };

  const handleDeleteMedicine = async (medicine) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete ${medicine.medicineName}?`
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/medicines/${medicine._id}`);
    await fetchMedicines();

    if (selectedMedicine?._id === medicine._id) {
      setSelectedMedicine(null);
      setHistory([]);
    }
  } catch (error) {
    console.error("Error deleting medicine:", error);
    alert(error?.response?.data?.message || "Failed to delete medicine.");
  }
};

  const handleOpenHistory = async (medicine) => {
    setSelectedMedicine(medicine);
    await fetchMedicineHistory(medicine._id);
  };

  const handleOpenEdit = (medicine) => {
    setSelectedMedicine(medicine);
    setShowEditForm(true);
  };

  const handleOpenRefill = (medicine) => {
    setSelectedMedicine(medicine);
    setShowRefillModal(true);
  };

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const matchesSearch =
        medicine.medicineName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        medicine.dosage?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesType =
        filters.type === "all" ? true : medicine.medicineType === filters.type;

      const matchesStatus =
        filters.status === "all" ? true : medicine.status === filters.status;

      const matchesSlot =
        filters.slot === "all"
          ? true
          : (medicine.scheduleSlots || []).includes(filters.slot);

      return matchesSearch && matchesType && matchesStatus && matchesSlot;
    });
  }, [medicines, filters]);

  const summary = useMemo(() => {
    const total = medicines.length;
    const active = medicines.filter((m) => m.status === "active").length;
    const paused = medicines.filter((m) => m.status === "paused").length;
    const completed = medicines.filter((m) => m.status === "completed").length;
    const lowStock = medicines.filter(
      (m) => Number(m.currentStock) <= Number(m.lowStockThreshold || 5)
    ).length;

    return { total, active, paused, completed, lowStock };
  }, [medicines]);

  return (
    <div className="container py-4 medicines-page">
      <div className="medicines-header-card mb-4">
        <div>
          <p className="medicines-subtitle mb-1">Medicine Manager</p>
          <h2 className="mb-2">Track medicines, schedules, and stock</h2>
          <p className="text-muted mb-0">
            Add medicines, manage Morning/Afternoon/Night slots, refill stock,
            and keep a slot-wise history.
          </p>
        </div>

        <button
          className="btn btn-success add-medicine-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Medicine
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-2">
          <div className="summary-card">
            <p className="summary-label">Total</p>
            <h4>{summary.total}</h4>
          </div>
        </div>

        <div className="col-md-6 col-lg-2">
          <div className="summary-card">
            <p className="summary-label">Active</p>
            <h4>{summary.active}</h4>
          </div>
        </div>

        <div className="col-md-6 col-lg-2">
          <div className="summary-card">
            <p className="summary-label">Paused</p>
            <h4>{summary.paused}</h4>
          </div>
        </div>

        <div className="col-md-6 col-lg-2">
          <div className="summary-card">
            <p className="summary-label">Completed</p>
            <h4>{summary.completed}</h4>
          </div>
        </div>

        <div className="col-md-12 col-lg-4">
          <div className="summary-card low-stock-summary">
            <p className="summary-label">Low Stock Alerts</p>
            <h4>{summary.lowStock}</h4>
            <small className="text-muted">
              Medicines at or below threshold.
            </small>
          </div>
        </div>
      </div>

      <MedicineFilters filters={filters} setFilters={setFilters} />

      <div className="row g-4 mt-1">
        <div className="col-lg-8">
         
          <MedicineList
  medicines={filteredMedicines}
  loading={loading}
  onViewHistory={handleOpenHistory}
  onEdit={handleOpenEdit}
  onRefill={handleOpenRefill}
  onTake={handleTakeSlot}
  onSkip={handleSkipSlot}
  onDelete={handleDeleteMedicine}
/>
        </div>

        <div className="col-lg-4">
          <MedicineHistory
            selectedMedicine={selectedMedicine}
            history={history}
            loading={historyLoading}
          />
        </div>
      </div>

      {showAddForm && (
        <AddMedicineForm
          show={showAddForm}
          onClose={() => setShowAddForm(false)}
          onMedicineAdded={handleMedicineAdded}
        />
      )}

      {showEditForm && selectedMedicine && (
        <EditMedicineForm
          show={showEditForm}
          medicine={selectedMedicine}
          onClose={() => setShowEditForm(false)}
          onMedicineUpdated={handleMedicineUpdated}
        />
      )}

      {showRefillModal && selectedMedicine && (
        <RefillMedicineModal
          show={showRefillModal}
          medicine={selectedMedicine}
          onClose={() => setShowRefillModal(false)}
          onRefillDone={handleRefillDone}
        />
      )}
    </div>
  );
}

export default MedicinesPage;