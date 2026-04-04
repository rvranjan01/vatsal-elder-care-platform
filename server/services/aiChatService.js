

// const { InferenceClient } = require("@huggingface/inference");

// const client = new InferenceClient(process.env.HF_TOKEN);

// const getLanguageInstruction = (language) => {
//   if (language === "hi") return "Reply in Hindi.";
//   if (language === "kn") return "Reply in Kannada.";
//   return "Reply in English.";
// };

// const buildSystemPrompt = (userName, language) => `
// You are a warm, caring AI companion for an elderly user named ${userName || "Friend"}.
// You act like a kind companion, a supportive nurse, and a parent-like doctor.
// ${getLanguageInstruction(language)}

// Rules:
// - Speak simply and gently.
// - Keep replies short, warm, and practical.
// - Never suggest changing medicine dosage.
// - If symptoms are serious, tell the user to contact a doctor or emergency help immediately.
// - Be emotionally supportive if the user feels lonely, sad, or anxious.
// `.trim();

// exports.generateAIReply = async ({ userName, history, language = "en" }) => {
//   try {
//     const response = await client.chatCompletion({
//       model: "meta-llama/Llama-3.1-8B-Instruct",
//       messages: [
//         { role: "system", content: buildSystemPrompt(userName, language) },
//         ...history,
//       ],
//       max_tokens: 220,
//       temperature: 0.7,
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
Use simple Indian English.
Do not use Hindi or Kannada words.
`;
};

const buildSystemPrompt = (userName, language) => `
You are a warm, caring AI companion for an elderly user named ${userName || "Friend"}.
You act like a kind companion, a supportive nurse, and a parent-like doctor.

${getLanguageInstruction(language)}

Important rules:
- Follow the selected language strictly.
- If the selected language is English, reply only in English.
- If the selected language is Hindi, reply only in Hindi script.
- If the selected language is Kannada, reply only in Kannada script.
- Speak simply and gently.
- Keep replies short, warm, and practical.
- Never suggest changing medicine dosage.
- If symptoms are serious, tell the user to contact a doctor or emergency help immediately.
- Be emotionally supportive if the user feels lonely, sad, or anxious.
- Do not mix languages.
`.trim();

exports.generateAIReply = async ({ userName, history, language = "en" }) => {
  try {
    const cleanHistory = (history || []).slice(-10).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await client.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        { role: "system", content: buildSystemPrompt(userName, language) },
        ...cleanHistory,
        {
          role: "system",
          content: `Current reply language is: ${language}. Follow it strictly.`,
        },
      ],
      max_tokens: 180,
      temperature: 0.5,
    });

    return (
      response?.choices?.[0]?.message?.content?.trim() ||
      "I am here with you. Please tell me how you are feeling."
    );
  } catch (error) {
    console.error("Hugging Face AI error:", error);
    return "I am having a little trouble replying right now. Please try again in a moment.";
  }
};