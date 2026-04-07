import React from "react";
import PropTypes from "prop-types";

const StatsCard = ({ icon, title, value, suffix, description, variant }) => {
  return (
    <div className={`card border-${variant} shadow-sm mb-3`}>
      <div className="card-body d-flex align-items-center gap-3">
        <span
          className={`display-6 text-${variant}`}
          role="img"
          aria-label={title}
        >
          {icon}
        </span>
        <div>
          <h6 className="text-uppercase text-muted mb-1">{title}</h6>
          <h3 className={`fw-bold text-${variant}`}>
            {value}
            {suffix && <span className="fs-6 text-muted">{suffix}</span>}
          </h3>
          {description && <p className="mb-0 text-muted">{description}</p>}
        </div>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  suffix: PropTypes.string,
  description: PropTypes.string,
  variant: PropTypes.string,
};

StatsCard.defaultProps = {
  suffix: "",
  description: "",
  variant: "primary",
};

export default StatsCard;
