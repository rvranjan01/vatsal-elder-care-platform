import React from "react";
import { useTranslation } from "react-i18next";

const QuickActions = ({ onSelect }) => {
  const { t } = useTranslation();

  const quickActions = [
    t("quickDoctor"),
    t("quickNurse"),
    t("quickCompanion"),
    t("quickMedicine"),
    t("quickLonely"),
  ];

  return (
    <div className="elder-chat-quick-actions">
      {quickActions.map((action) => (
        <button
          key={action}
          type="button"
          className="elder-chat-quick-actions__button"
          onClick={() => onSelect(action)}
        >
          {action}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;