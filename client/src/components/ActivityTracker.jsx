import React from "react";
import PropTypes from "prop-types";

const ActivityTracker = ({ stats, timeline }) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-light">
        <h5 className="card-title mb-0">
          <i className="bi bi-graph-up-arrow me-2"></i>Activity Tracker
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-lg-3">
            <div className="border rounded p-3 h-100">
              <div className="text-muted small">Game Sessions</div>
              <div className="h4 fw-bold">{stats.gamesPlayed}</div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="border rounded p-3 h-100">
              <div className="text-muted small">Total Score</div>
              <div className="h4 fw-bold">{stats.totalGameScore}</div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="border rounded p-3 h-100">
              <div className="text-muted small">Platform Time</div>
              <div className="h4 fw-bold">{stats.platformMinutes}</div>
              <small className="text-muted">min</small>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="border rounded p-3 h-100">
              <div className="text-muted small">Avg Daily Activity</div>
              <div className="h4 fw-bold">{stats.dailyAverage}</div>
              <small className="text-muted">min</small>
            </div>
          </div>
        </div>

        <h6 className="mb-3">Recent Activity</h6>
        {timeline.length === 0 ? (
          <p className="text-muted">No activity tracked yet.</p>
        ) : (
          <div className="list-group list-group-flush">
            {timeline.slice(0, 8).map((item, index) => (
              <div
                key={index}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
              >
                <div>
                  <div className="fw-bold">{item.title}</div>
                  <div className="text-muted small">{item.details}</div>
                </div>
                <div className="text-end">
                  <div className="fw-bold">{item.value}</div>
                  <small className="text-muted">{item.time}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

ActivityTracker.propTypes = {
  stats: PropTypes.shape({
    gamesPlayed: PropTypes.number,
    totalGameScore: PropTypes.number,
    platformMinutes: PropTypes.number,
    dailyAverage: PropTypes.number,
  }).isRequired,
  timeline: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      details: PropTypes.string,
      value: PropTypes.string,
      time: PropTypes.string,
    }),
  ).isRequired,
};

export default ActivityTracker;
