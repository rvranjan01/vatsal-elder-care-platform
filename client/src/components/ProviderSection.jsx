import React from "react";
import PropTypes from "prop-types";

const ProviderSection = ({ title, providers, loading, onView, onBook }) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-light">
        <h5 className="card-title mb-0">{title}</h5>
      </div>
      <div className="card-body">
        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : providers.length === 0 ? (
          <p className="text-muted">No providers available</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 g-3">
            {providers.map((provider) => (
              <div key={provider._id} className="col">
                <div className="border rounded p-3 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="mb-1">{provider.name}</h6>
                    <p className="mb-1 text-muted">{provider.role}</p>
                    <p className="mb-0 small text-muted">
                      {provider.email ||
                        provider.availability ||
                        "No extra info"}
                    </p>
                  </div>
                  <div className="mt-3 d-flex gap-2 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onView(provider)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => onBook(provider)}
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

ProviderSection.propTypes = {
  title: PropTypes.string.isRequired,
  providers: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onView: PropTypes.func.isRequired,
  onBook: PropTypes.func.isRequired,
};

ProviderSection.defaultProps = {
  loading: false,
};

export default ProviderSection;
