const ApiError = require("../utils/ApiError");

// =====================================
// LIBRETRANSLATE CONFIGURATION
// =====================================

const TRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL ||
  "http://127.0.0.1:5001/translate";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const REQUEST_TIMEOUT = 30000;

// =====================================
// DELAY HELPER
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
  if (
    typeof text !== "string" ||
    !text.trim()
  ) {
    return "";
  }

  const requestBody = {
    q: text.trim(),
    source: "en",
    target,
    format: "text",
  };

  let lastError;

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      const controller =
        new AbortController();

      const timeoutId =
        setTimeout(
          () => controller.abort(),
          REQUEST_TIMEOUT
        );

      const response = await fetch(
        TRANSLATE_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },

          body: JSON.stringify(
            requestBody
          ),

          signal:
            controller.signal,
        }
      );

      clearTimeout(timeoutId);

      const responseText =
        await response.text();

      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(
            responseText
          );
        } catch (error) {
          throw new Error(
            `Translation service returned an invalid response.`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
          `Translation request failed with status ${response.status}.`
        );
      }

      if (
        typeof data?.translatedText !==
          "string" ||
        !data.translatedText.trim()
      ) {
        throw new Error(
          "Translation service returned an invalid response."
        );
      }

      return data.translatedText.trim();

    } catch (error) {
      lastError = error;

      console.error(
        `Translation attempt ${attempt}/${MAX_RETRIES} failed:`,
        error.message
      );

      if (
        attempt < MAX_RETRIES
      ) {
        await delay(
          RETRY_DELAY * attempt
        );
      }
    }
  }

  throw new ApiError(
    502,
    `Question translation failed: ${lastError?.message || "Translation service unavailable."}`
  );
};

// =====================================
// TRANSLATE COMPLETE QUESTION
// IMPORTANT:
// Sequential requests prevent the
// LibreTranslate service from being
// overloaded by 6 simultaneous requests.
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