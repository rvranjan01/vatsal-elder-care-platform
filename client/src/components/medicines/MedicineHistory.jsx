function MedicineHistory({ selectedMedicine, history, loading }) {
  return (
    <div className="card border-0 shadow-sm medicine-history-card">
      <div className="card-body">
        <h5 className="mb-3">Medicine History</h5>

        {!selectedMedicine ? (
          <p className="text-muted mb-0">
            Click “View History” on a medicine card to see slot-wise logs.
          </p>
        ) : loading ? (
          <p className="mb-0">Loading history...</p>
        ) : (
          <>
            <div className="history-medicine-title mb-3">
              <strong>{selectedMedicine.medicineName}</strong>
              <div className="text-muted small">{selectedMedicine.dosage}</div>
            </div>

            {!history.length ? (
              <p className="text-muted mb-0">No history found yet.</p>
            ) : (
              <div className="history-list">
                {history.map((item) => (
                  <div className="history-item" key={item._id}>
                    <div className="d-flex justify-content-between gap-2">
                      <div>
                        <strong className="text-capitalize">
                          {item.action}
                        </strong>
                        <div className="small text-muted">
                          Slot: {item.slot || "N/A"}
                        </div>
                      </div>
                      <div className="small text-muted text-end">
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {item.note && (
                      <p className="small mb-0 mt-2 text-muted">{item.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MedicineHistory;
