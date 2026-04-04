import React from "react";
import ChatInput from "./ChatInput";
import VoiceControls from "./VoiceControls";
import QuickActions from "./QuickActions";

const ChatComposer = ({
  input,
  setInput,
  onSend,
  onQuickAction,
  listening,
  onStartListening,
  onStopSpeaking,
  isVoiceSupported,
  sending,
}) => {
  return (
    <div className="elder-chat-composer">
      <QuickActions onSelect={onQuickAction} />

      <VoiceControls
        listening={listening}
        onStartListening={onStartListening}
        onStopSpeaking={onStopSpeaking}
        isVoiceSupported={isVoiceSupported}
      />

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={onSend}
        disabled={sending}
        listening={listening}
      />
    </div>
  );
};

export default ChatComposer;