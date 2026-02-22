import { Link } from "react-router-dom";

function FamilyDashboard() {
  return (
    <div>
      <h2 className="mb-4">Family Dashboard</h2>

      <div className="row">
        <div className="col-md-4 mb-3">
          <Link to="/health" className="btn btn-success w-100">
            View Elder Health
          </Link>
        </div>

        <div className="col-md-4 mb-3">
          <Link to="/booking" className="btn btn-primary w-100">
            Doctor Booking
          </Link>
        </div>

        <div className="col-md-4 mb-3">
          <Link to="/chatbot" className="btn btn-dark w-100">
            Chatbot Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FamilyDashboard;
