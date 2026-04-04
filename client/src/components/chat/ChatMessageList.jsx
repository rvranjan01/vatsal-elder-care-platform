import React, { useEffect, useRef } from "react";

const formatTime = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatMessageList = ({ messages, loadingHistory, typing }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  if (loadingHistory) {
    return <div className="elder-chat-loading">Loading chat...</div>;
  }

  return (
    <div className="elder-chat-messages">
      {messages.map((msg, index) => {
        const isUser = msg.sender === "user";
        return (
          <div
            key={msg._id || `${msg.sender}-${index}`}
            className={`elder-chat-message ${
              isUser ? "elder-chat-message--user" : "elder-chat-message--bot"
            }`}
          >
            <div className="elder-chat-message__bubble">
              <p>{msg.text}</p>
              <span className="elder-chat-message__time">
                {formatTime(msg.createdAt)}
              </span>
            </div>
          </div>
        );
      })}

      {typing && (
        <div className="elder-chat-message elder-chat-message--bot">
          <div className="elder-chat-message__bubble elder-chat-message__bubble--typing">
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessageList;