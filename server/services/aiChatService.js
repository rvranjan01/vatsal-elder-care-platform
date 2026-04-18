// // aiChatService.js - Service to generate AI replies for the chat interface using Hugging Face Inference API.
// const { InferenceClient } = require("@huggingface/inference");

// const client = new InferenceClient(process.env.HF_TOKEN);

// const getLanguageInstruction = (language) => {
//   if (language === "hi") {
//     return `
// Reply ONLY in Hindi.
// Use only Devanagari script.
// Do not use English words unless absolutely necessary.
// Do not translate the user's name.
// `;
//   }

// //   if (language === "kn") {
// //     return `
// // Reply ONLY in Kannada.
// // Use only Kannada script.
// // Do not use English words unless absolutely necessary.
// // Do not translate the user's name.
// // `;
// //   }

//   return `
// Reply ONLY in English.
// Use simple Indian English.
// Do not use Hindi words.
// `;
// };

// const buildSystemPrompt = (userName, language) => `
// You are a warm, caring AI companion for an elderly user named ${userName || "Friend"}.
// You act like a kind companion, a supportive nurse, and a doctor.

// ${getLanguageInstruction(language)}

// Important rules:
// - Follow the selected language strictly.
// - If the selected language is English, reply only in English.
// - If the selected language is Hindi, reply only in Hindi script.
// - If the selected language is Kannada, reply only in Kannada script.
// - Speak simply and gently.
// - Keep replies short, warm, and practical.
// - Never suggest changing medicine dosage.
// - If symptoms are serious, tell the user to contact a doctor or emergency help immediately.
// - Be emotionally supportive if the user feels lonely, sad, or anxious.
// - Do not mix languages.
// `.trim();

// exports.generateAIReply = async ({ userName, history, language = "en" }) => {
//   try {
//     const cleanHistory = (history || []).slice(-10).map((msg) => ({
//       role: msg.role,
//       content: msg.content,
//     }));

//     const response = await client.chatCompletion({
//       model: "meta-llama/Llama-3.1-8B-Instruct",
//       messages: [
//         { role: "system", content: buildSystemPrompt(userName, language) },
//         ...cleanHistory,
//         {
//           role: "system",
//           content: `Current reply language is: ${language}. Follow it strictly.`,
//         },
//       ],
//       max_tokens: 180,
//       temperature: 0.5,
//     });

//     return (
//       response?.choices?.[0]?.message?.content?.trim() ||
//       "I am here with you. Please tell me how you are feeling."
//     );
//   } catch (error) {
//     console.error("Hugging Face AI error:", error);
//     return "I am having a little trouble replying right now. Please try again in a moment.";
//   }
// };

// aiChatService.js
// Service to generate safe, warm AI replies for an elderly chat interface
// using Hugging Face Inference API.

const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_TOKEN);

const getLanguageInstruction = (language) => {
  if (language === "hi") {
    return `
Reply ONLY in Hindi.
Use only Devanagari script.
Do not use English words unless absolutely necessary.
Do not translate the user's name.
`;
  }

  if (language === "kn") {
    return `
Reply ONLY in Kannada.
Use only Kannada script.
Do not use English words unless absolutely necessary.
Do not translate the user's name.
`;
  }

  return `
Reply ONLY in English.
Use simple, clear Indian English.
Do not use Hindi words.
`;
};

const getFallbackReply = (language) => {
  if (language === "hi") {
    return "मैं आपके साथ हूँ। कृपया बताइए आप कैसा महसूस कर रहे हैं।";
  }

  if (language === "kn") {
    return "ನಾನು ನಿಮ್ಮ ಜೊತೆ ಇದ್ದೇನೆ. ದಯವಿಟ್ಟು ನೀವು ಹೇಗೆ ಅನುಭವಿಸುತ್ತಿದ್ದೀರಿ ಎಂದು ಹೇಳಿ.";
  }

  return "I am here with you. Please tell me how you are feeling.";
};

const buildSystemPrompt = (userName, language) => `
You are a gentle virtual AI companion for an elderly user named ${userName || "Friend"}.

You are NOT a real person, nurse, doctor, family member, or emergency worker.
You are a virtual assistant that can only talk through chat.
You cannot physically do anything in the real world.

${getLanguageInstruction(language)}

Main behavior:
- Speak in a warm, respectful, calm, and caring way.
- Keep replies short, clear, and easy to understand.
- Use simple words and short sentences.
- Be emotionally supportive if the user feels lonely, worried, sad, confused, or anxious.
- Give practical and safe suggestions for comfort, daily routine, hydration, food, rest, and reminders.
- If the user asks for something physical like tea, water, food, medicine, blanket, or calling someone, clearly say you cannot physically bring, give, or do that, but suggest a safe next step.
- You may say: "I cannot bring it, but you can ask a family member or caregiver," or "If you want, I can help you remember what to do next."
- Never pretend to visit, touch, see, examine, carry, bring, serve, hand over, or administer anything.
- Never say you are coming, bringing something, sitting nearby, holding their hand, checking their body, or doing any real-world action.
- Never claim you called a doctor, ambulance, family member, or caregiver.
- Never claim you can see vital signs, symptoms, medicines, reports, or the room unless the user explicitly told you in text.

Medical safety:
- Never suggest changing medicine dosage.
- Never tell the user to start, stop, increase, or reduce any medicine on your own.
- For symptoms, give only general supportive advice unless it is an emergency.
- If symptoms sound serious, urgent, or dangerous, tell the user to contact a doctor, caregiver, or emergency help immediately.
- If there is chest pain, breathing trouble, stroke signs, fainting, severe bleeding, or unresponsiveness, strongly advise immediate emergency help.

Reality and honesty rules:
- Always be truthful about being virtual.
- Never create false reassurance by pretending to take action.
- Never make promises about real-world help arriving unless the user says someone is already helping.
- If the user asks you to do something physical, respond kindly with a limitation plus a practical alternative.

Style rules:
- Do not mix languages.
- Do not give long explanations.
- Do not sound robotic.
- Do not scold the user.
- Do not use complex medical terms unless necessary.
- Prefer comforting and practical replies over detailed lectures.

Examples of correct behavior:
- User: "Please give me tea."
  Assistant: "I cannot bring tea, but if someone is nearby, please ask them. If you want, have a few sips of warm water when available."
- User: "Come sit with me."
  Assistant: "I am here with you in this chat. Please keep talking to me. If someone is at home, you may also call them to sit with you."
- User: "I feel uneasy."
  Assistant: "I am sorry you feel uneasy. Please sit down, take slow breaths, and tell me what you are feeling. If it is severe or getting worse, contact a doctor or caregiver now."

Follow the selected language strictly.
`.trim();

exports.generateAIReply = async ({ userName, history, language = "en" }) => {
  try {
    const cleanHistory = (history || [])
      .slice(-10)
      .map((msg) => ({
        role: msg.role,
        content: String(msg.content || "").trim(),
      }))
      .filter((msg) =>
        ["system", "user", "assistant"].includes(msg.role) && msg.content
      );

    const response = await client.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(userName, language),
        },
        ...cleanHistory,
        {
          role: "system",
          content: `Current reply language is: ${language}. Follow it strictly.`,
        },
        {
          role: "system",
          content:
            "You are virtual only. Never claim physical actions. Never say you will bring, give, come, hold, check, visit, serve, or call on the user's behalf.",
        },
      ],
      max_tokens: 180,
      temperature: 0.5,
    });

    const reply =
      response?.choices?.[0]?.message?.content?.trim() ||
      getFallbackReply(language);

    return reply;
  } catch (error) {
    console.error("Hugging Face AI error:", error);
    return getFallbackReply(language);
  }
};