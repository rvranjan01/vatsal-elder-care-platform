import { Link } from "react-router-dom";

function ElderDashboard() {
  return (
    <div>
      <h2 className="mb-4">Elder Dashboard</h2>

      <div className="row">
        <div className="col-md-4 mb-3">
          <Link to="/health" className="btn btn-success w-100">
            Health Records
          </Link>
        </div>

        <div className="col-md-4 mb-3">
          <Link to="/games" className="btn btn-info w-100">
            Games
          </Link>
        </div>

        <div className="col-md-4 mb-3">
          <Link to="/yoga" className="btn btn-warning w-100">
            Yoga
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ElderDashboard;
