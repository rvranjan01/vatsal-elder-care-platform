import React from "react";
import { useTranslation } from "react-i18next";

const VoiceControls = ({
  listening,
  onStartListening,
  onStopSpeaking,
  isVoiceSupported,
}) => {
  const { t } = useTranslation();

  return (
    <div className="elder-chat-voice-controls">
      <button
        type="button"
        className={`elder-chat-voice-btn ${listening ? "is-listening" : ""}`}
        onClick={onStartListening}
        disabled={!isVoiceSupported}
        title={isVoiceSupported ? t("listening") : t("voiceNotSupported")}
      >
        {listening ? "🎙️ " + t("listening") : "🎤 Voice"}
      </button>

      <button
        type="button"
        className="elder-chat-stop-btn"
        onClick={onStopSpeaking}
      >
        ⏹ {t("speakReply")}
      </button>
    </div>
  );
};

export default VoiceControls;