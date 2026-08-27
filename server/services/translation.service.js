const ApiError = require("../utils/ApiError");

// =====================================
// LIBRETRANSLATE CONFIGURATION
// =====================================

const TRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL ||
  "http://127.0.0.1:5001/translate";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// =====================================
// DELAY
// =====================================

const delay = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

// =====================================
// TRANSLATE SINGLE TEXT
// =====================================

const translateText = async (
  text,
  target = "hi"
) => {
  // Empty text ko translate nahi karna
  if (
    typeof text !== "string" ||
    !text.trim()
  ) {
    return "";
  }

  let lastError;

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      const response = await fetch(
        TRANSLATE_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            q: text.trim(),
            source: "en",
            target,
            format: "text",
          }),
        }
      );

      const responseText =
        await response.text();

      let data = {};

      try {
        if (responseText) {
          data = JSON.parse(responseText);
        }
      } catch {
        throw new Error(
          `Translation service returned invalid JSON: ${responseText}`
        );
      }

      // HTTP error
      if (!response.ok) {
        throw new Error(
          data?.error ||
          `Translation request failed with status ${response.status}.`
        );
      }

      // Validate response
      if (
        typeof data?.translatedText !== "string" ||
        !data.translatedText.trim()
      ) {
        throw new Error(
          "Translation service returned an invalid response."
        );
      }

      return data.translatedText;

    } catch (error) {
      lastError = error;

      // Last attempt hai to retry nahi
      if (attempt < MAX_RETRIES) {
        await delay(
          RETRY_DELAY * attempt
        );
      }
    }
  }

  throw new ApiError(
    502,
    `Question translation failed after ${MAX_RETRIES} attempts: ${lastError.message}`
  );
};

// =====================================
// TRANSLATE COMPLETE QUESTION
// =====================================
// IMPORTANT:
// Sequential translation use kar rahe hain.
// Ek saath 6 requests nahi jayengi.
// Render LibreTranslate instance overload/invalid
// response ka chance significantly kam hoga.
// =====================================

const translateQuestionToHindi =
  async (questionData) => {

    const questionHindi =
      await translateText(
        questionData.question
      );

    const optionAHindi =
      await translateText(
        questionData.optionA
      );

    const optionBHindi =
      await translateText(
        questionData.optionB
      );

    const optionCHindi =
      await translateText(
        questionData.optionC
      );

    const optionDHindi =
      await translateText(
        questionData.optionD
      );

    const explanationHindi =
      await translateText(
        questionData.explanation || ""
      );

    return {
      questionHindi,
      optionAHindi,
      optionBHindi,
      optionCHindi,
      optionDHindi,
      explanationHindi,
    };
  };

// =====================================
// EXPORTS
// =====================================

module.exports = {
  translateText,
  translateQuestionToHindi,
};