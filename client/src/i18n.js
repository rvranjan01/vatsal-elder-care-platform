import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          chatTitle: "AI Companion",
          chatSubtitle: "Companion · Nurse · Doctor",
          placeholder: "Type your message...",
          send: "Send",
          listening: "Listening...",
          voiceNotSupported:
            "Voice input is not supported in this browser. Please use Chrome or Edge.",
          loadChat: "Loading chat...",
          fallbackReply:
            "Sorry, I am not able to reply right now. Please try again.",
          quickDoctor: "Book Doctor",
          quickNurse: "Book Nurse",
          quickCompanion: "Book Companion",
          quickMedicine: "Medicine Reminder",
          quickLonely: "I feel lonely",
          language: "Language",
          speakReply: "Speak reply",
        },
      },
      hi: {
        translation: {
          chatTitle: "एआई साथी",
          chatSubtitle: "साथी · नर्स · डॉक्टर",
          placeholder: "अपना संदेश लिखें...",
          send: "भेजें",
          listening: "सुन रहा हूँ...",
          voiceNotSupported:
            "इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया Chrome या Edge का उपयोग करें।",
          loadChat: "चैट लोड हो रही है...",
          fallbackReply:
            "क्षमा करें, मैं अभी उत्तर नहीं दे पा रहा हूँ। कृपया फिर प्रयास करें।",
          quickDoctor: "डॉक्टर बुक करें",
          quickNurse: "नर्स बुक करें",
          quickCompanion: "साथी बुक करें",
          quickMedicine: "दवाई की याद",
          quickLonely: "मुझे अकेलापन लग रहा है",
          language: "भाषा",
          speakReply: "उत्तर सुनाएँ",
        },
      },
      kn: {
        translation: {
          chatTitle: "ಎಐ ಸಂಗಾತಿ",
          chatSubtitle: "ಸಂಗಾತಿ · ನರ್ಸ್ · ಡಾಕ್ಟರ್",
          placeholder: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಬರೆಯಿರಿ...",
          send: "ಕಳುಹಿಸಿ",
          listening: "ಕೆಳಲಾಗುತ್ತಿದೆ...",
          voiceNotSupported:
            "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು Chrome ಅಥವಾ Edge ಬಳಸಿ.",
          loadChat: "ಚಾಟ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
          fallbackReply:
            "ಕ್ಷಮಿಸಿ, ಈಗ ಉತ್ತರಿಸಲು ಆಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
          quickDoctor: "ಡಾಕ್ಟರ್ ಬುಕ್ ಮಾಡಿ",
          quickNurse: "ನರ್ಸ್ ಬುಕ್ ಮಾಡಿ",
          quickCompanion: "ಸಂಗಾತಿಯನ್ನು ಬುಕ್ ಮಾಡಿ",
          quickMedicine: "ಔಷಧಿ ಜ್ಞಾಪನೆ",
          quickLonely: "ನನಗೆ ಒಂಟಿತನವಾಗಿದೆ",
          language: "ಭಾಷೆ",
          speakReply: "ಉತ್ತರವನ್ನು ಕೇಳಿ",
        },
      },
    },
  });

export default i18n;
