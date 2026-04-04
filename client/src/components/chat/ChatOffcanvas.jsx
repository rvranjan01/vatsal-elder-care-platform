import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../../services/api";
import { getSpeechRecognition, mapLanguageToSpeechLocale, speakText, stopSpeaking } from "../../utils/voice";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatComposer from "./ChatComposer";
import "./chat.css";

const ChatOffcanvas = ({ isOpen, onClose, userName = "Friend" }) => {
  const { i18n, t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState(i18n.language || "en");
  const [error, setError] = useState("");

  const SpeechRecognition = useMemo(() => getSpeechRecognition(), []);
  const isVoiceSupported = !!SpeechRecognition;

  useEffect(() => {
    i18n.changeLanguage(language);
    stopSpeaking();
  }, [language, i18n]);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    } else {
      stopSpeaking();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      setError("");

      const { data } = await API.get("/chat/history");

      if (data?.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load chat history.");
    } finally {
      setLoadingHistory(false);
    }
  };

  const sendMessage = async (customMessage) => {
    const messageToSend = (customMessage ?? input).trim();
    if (!messageToSend || sending) return;

    const optimisticUserMessage = {
      _id: `temp-user-${Date.now()}`,
      sender: "user",
      text: messageToSend,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMessage]);
    setInput("");
    setTyping(true);
    setSending(true);
    setError("");

    try {
      const { data } = await API.post("/chat/message", {
        message: messageToSend,
        userName,
        language,
      });

      if (data?.success) {
        const userMsg = data.userMessage || optimisticUserMessage;
        const botMsg =
          data.botMessage || {
            _id: `temp-bot-${Date.now()}`,
            sender: "bot",
            text: data.reply || t("fallbackReply"),
            createdAt: new Date().toISOString(),
          };

        setMessages((prev) => {
          const withoutTemp = prev.filter(
            (msg) => msg._id !== optimisticUserMessage._id
          );
          return [...withoutTemp, userMsg, botMsg];
        });

        if (botMsg?.text) {
          speakText(botMsg.text, language);
        }
      } else {
        throw new Error(data?.message || t("fallbackReply"));
      }
    } catch (err) {
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== optimisticUserMessage._id)
      );

      const fallbackMessage = {
        _id: `error-bot-${Date.now()}`,
        sender: "bot",
        text: err?.response?.data?.message || err?.message || t("fallbackReply"),
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
      speakText(fallbackMessage.text, language);
      setError(fallbackMessage.text);
    } finally {
      setTyping(false);
      setSending(false);
    }
  };

  const handleQuickAction = (text) => {
    sendMessage(text);
  };

  const handleStartListening = () => {
    if (!SpeechRecognition) {
      setError(t("voiceNotSupported"));
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = mapLanguageToSpeechLocale(language);
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setListening(true);
      setError("");

      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event?.results?.[0]?.[0]?.transcript || "";
        setInput(transcript);
        setListening(false);

        if (transcript.trim()) {
          setTimeout(() => sendMessage(transcript), 300);
        }
      };

      recognition.onerror = () => {
        setListening(false);
        setError(t("voiceNotSupported"));
      };

      recognition.onend = () => {
        setListening(false);
      };
    } catch (err) {
      setListening(false);
      setError(t("voiceNotSupported"));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="elder-chat-overlay" onClick={onClose}></div>

      <aside className={`elder-chat-panel ${isOpen ? "open" : ""}`}>
        <ChatHeader
          onClose={onClose}
          language={language}
          onLanguageChange={setLanguage}
        />

        {error && <div className="elder-chat-error">{error}</div>}

        <ChatMessageList
          messages={messages}
          loadingHistory={loadingHistory}
          typing={typing}
        />

        <ChatComposer
          input={input}
          setInput={setInput}
          onSend={() => sendMessage()}
          onQuickAction={handleQuickAction}
          listening={listening}
          onStartListening={handleStartListening}
          onStopSpeaking={stopSpeaking}
          isVoiceSupported={isVoiceSupported}
          sending={sending}
        />
      </aside>
    </>
  );
};

export default ChatOffcanvas;