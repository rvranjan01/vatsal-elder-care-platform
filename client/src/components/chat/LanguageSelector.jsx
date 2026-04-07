import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = ({ language, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="elder-chat-language">
      <label htmlFor="chat-language" className="elder-chat-language__label">
        {t("language")}
      </label>

      <select
        id="chat-language"
        className="elder-chat-language__select"
        value={language}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        {/* <option value="kn">ಕನ್ನಡ</option> */}
      </select>
    </div>
  );
};

export default LanguageSelector;