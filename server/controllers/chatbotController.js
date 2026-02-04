exports.chatbotResponse = (req, res) => {
  const { message } = req.body;

  let reply = "I am here to help you.";

  const userMessage = message.toLowerCase();

  if (userMessage.includes("hello") || userMessage.includes("hi")) {
    reply = "Hello! How are you feeling today?";
  } 
  else if (userMessage.includes("lonely")) {
    reply = "You are not alone. I am always here to talk to you.";
  }
  else if (userMessage.includes("medicine")) {
    reply = "Please remember to take your medicines on time.";
  }
  else if (userMessage.includes("help")) {
    reply = "You can talk to me, play games, or check your health details.";
  }
  else if (userMessage.includes("thank")) {
    reply = "You are always welcome. Take care!";
  }

  res.status(200).json({ reply });
};
