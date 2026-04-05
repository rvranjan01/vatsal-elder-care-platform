import React from "react";

function Footer() {
  return (
    <footer className="bg-light text-dark py-5 mt-5">
      <div className="container">
        {/* Main Footer Content */}
        <div className="row mb-4">
          {/* Branding Section */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">
              <i className="fas fa-heart text-primary"></i> Vatsal
            </h5>
            <p className="text-muted small">
              Empowering elderly care with compassion, technology, and community
              support.
            </p>
            {/* Social Media Icons */}
            <div className="mt-3">
              <a href="#" className="text-muted me-3 text-decoration-none">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-muted me-3 text-decoration-none">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-muted me-3 text-decoration-none">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-muted text-decoration-none">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div className="col-md-3 mb-4 mb-md-0">
            {/* <h6 className="fw-bold mb-3">Services</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  Doctor Booking
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  Nurse Services
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  Companion Care
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  Health Tracking
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  Medicine Management
                </a>
              </li>
            </ul> */}
          </div>

          {/* Resources Section */}
          <div className="col-md-3 mb-4 mb-md-0">
            {/* <h6 className="fw-bold mb-3">Resources</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  Documentation
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  Health Tips
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  Events & Yoga
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  Games & Activities
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  Support
                </a>
              </li>
            </ul> */}
          </div>

          {/* Company Section */}
          <div className="col-md-3">
            {/* <h6 className="fw-bold mb-3">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  Blog
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  Careers
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  Contact
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small">
                  Partners
                </a>
              </li>
            </ul> */}
          </div>
        </div>

        {/* Divider */}
        {/* <hr className="bg-secondary my-4" /> */}

        {/* Bottom Footer */}
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <p className="text-muted small mb-0">
              © 2026 Vatsal - Elder Care System. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <a href="#" className="text-muted text-decoration-none small me-3">
              Privacy Policy
            </a>
            <a href="#" className="text-muted text-decoration-none small me-3">
              Terms of Service
            </a>
            <a href="#" className="text-muted text-decoration-none small">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
