// export const getSpeechRecognition = () => {
//   return window.SpeechRecognition || window.webkitSpeechRecognition || null;
// };

// export const mapLanguageToSpeechLocale = (language) => {
//   const map = {
//     en: "en-IN",
//     hi: "hi-IN",
//     kn: "kn-IN",
//   };

//   return map[language] || "en-IN";
// };

// export const speakText = (text, language = "en") => {
//   if (!window.speechSynthesis || !text) return;

//   const utterance = new SpeechSynthesisUtterance(text);
//   const locale = mapLanguageToSpeechLocale(language);
//   utterance.lang = locale;
//   utterance.rate = 1;
//   utterance.pitch = 1;
//   utterance.volume = 1;

//   const voices = window.speechSynthesis.getVoices();
//   const matchedVoice =
//     voices.find((voice) => voice.lang === locale) ||
//     voices.find((voice) => voice.lang?.startsWith(language));

//   if (matchedVoice) {
//     utterance.voice = matchedVoice;
//   }

//   window.speechSynthesis.cancel();
//   window.speechSynthesis.speak(utterance);
// };

// export const stopSpeaking = () => {
//   if (window.speechSynthesis) {
//     window.speechSynthesis.cancel();
//   }
// };



export const getSpeechRecognition = () => {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export const mapLanguageToSpeechLocale = (language) => {
  const map = {
    en: "en-IN",
    hi: "hi-IN",
    kn: "kn-IN",
  };

  return map[language] || "en-IN";
};

const getVoiceMatch = (voices, language) => {
  const locale = mapLanguageToSpeechLocale(language);

  const exactLocaleMatch = voices.find(
    (voice) => voice.lang?.toLowerCase() === locale.toLowerCase()
  );
  if (exactLocaleMatch) return exactLocaleMatch;

  const baseLanguage = language.toLowerCase();

  const baseLangMatch = voices.find((voice) =>
    voice.lang?.toLowerCase().startsWith(baseLanguage)
  );
  if (baseLangMatch) return baseLangMatch;

  if (language === "en") {
    const englishFallback = voices.find((voice) =>
      voice.lang?.toLowerCase().startsWith("en")
    );
    if (englishFallback) return englishFallback;
  }

  if (language === "hi") {
    const hindiFallback = voices.find((voice) =>
      voice.lang?.toLowerCase().startsWith("hi")
    );
    if (hindiFallback) return hindiFallback;
  }

  if (language === "kn") {
    const kannadaFallback = voices.find((voice) =>
      voice.lang?.toLowerCase().startsWith("kn")
    );
    if (kannadaFallback) return kannadaFallback;
  }

  return null;
};

export const speakText = (text, language = "en") => {
  if (!window.speechSynthesis || !text) return;

  window.speechSynthesis.cancel();

  const speakNow = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    const locale = mapLanguageToSpeechLocale(language);
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = getVoiceMatch(voices, language);

    utterance.lang = locale;
    utterance.rate = language === "en" ? 0.95 : 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
    }

    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();

  if (voices && voices.length > 0) {
    speakNow();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      speakNow();
    };
  }
};

export const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};