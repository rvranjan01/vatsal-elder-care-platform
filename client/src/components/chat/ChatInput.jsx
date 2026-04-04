import React from "react";
import { useTranslation } from "react-i18next";

const ChatInput = ({
  value,
  onChange,
  onSend,
  disabled = false,
  listening = false,
}) => {
  const { t } = useTranslation();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="elder-chat-input-wrap">
      <textarea
        className="elder-chat-input"
        rows="2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={listening ? t("listening") : t("placeholder")}
        disabled={disabled}
      />

      <button
        type="button"
        className="elder-chat-send-btn"
        onClick={onSend}
        disabled={disabled || !value.trim()}
      >
        {t("send")}
      </button>
    </div>
  );
};

export default ChatInput;