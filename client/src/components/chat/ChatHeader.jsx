import React from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

const ChatHeader = ({ onClose, language, onLanguageChange }) => {
  const { t } = useTranslation();

  return (
    <div className="elder-chat-header">
      <div className="elder-chat-header__content">
        <div className="elder-chat-header__avatar">🤖</div>
        <div>
          <h2 className="elder-chat-header__title">{t("chatTitle")}</h2>
          <p className="elder-chat-header__subtitle">{t("chatSubtitle")}</p>
        </div>
      </div>

      <div className="elder-chat-header__actions">
        <LanguageSelector
          language={language}
          onChange={onLanguageChange}
        />
        <button
          type="button"
          className="elder-chat-header__close"
          onClick={onClose}
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;