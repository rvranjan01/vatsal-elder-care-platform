import React from "react";

const ChatLauncher = ({ onClick, unreadCount = 0 }) => {
  return (
    <button
      type="button"
      className="elder-chat-launcher"
      onClick={onClick}
      aria-label="Open AI chat assistant"
    >
      <span className="elder-chat-launcher__icon">💬</span>
      <span className="elder-chat-launcher__text">AI Help</span>

      {unreadCount > 0 && (
        <span className="elder-chat-launcher__badge">{unreadCount}</span>
      )}
    </button>
  );
};

export default ChatLauncher;