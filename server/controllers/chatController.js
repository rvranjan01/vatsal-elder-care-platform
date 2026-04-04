
const Conversation = require("../models/Conversation");
const ChatMessage = require("../models/ChatMessage");
const { generateAIReply } = require("../services/aiChatService");

exports.getChatHistory = async (req, res) => {
  try {
    const elderId = req.user.id;

    const conversation = await Conversation.findOne({ elderId });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    const messages = await ChatMessage.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      conversationId: conversation._id,
      messages,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching chat history",
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const elderId = req.user.id;
    const { message, userName, language } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let conversation = await Conversation.findOne({ elderId });

    if (!conversation) {
      conversation = await Conversation.create({
        elderId,
        title: "AI Companion Chat",
      });
    }

    const userMessage = await ChatMessage.create({
      conversationId: conversation._id,
      elderId,
      sender: "user",
      text: message.trim(),
    });

    const recentMessages = await ChatMessage.find({
      conversationId: conversation._id,
    })
      .sort({ createdAt: -1 })
      .limit(12);

    const history = recentMessages.reverse().map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    const reply = await generateAIReply({
      userName,
      history,
      language,
    });

    const botMessage = await ChatMessage.create({
      conversationId: conversation._id,
      elderId,
      sender: "bot",
      text: reply,
    });

    conversation.lastMessage = reply;
    await conversation.save();

    res.status(200).json({
      success: true,
      reply,
      userMessage,
      botMessage,
    });
  } catch (error) {
    console.error("Error sending chat message:", error);
    res.status(500).json({
      success: false,
      message: "Server error while sending message",
    });
  }
};