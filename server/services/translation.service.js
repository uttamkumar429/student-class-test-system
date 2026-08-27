const ApiError = require("../utils/ApiError");

// =====================================
// LIBRETRANSLATE CONFIGURATION
// =====================================

const TRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL ||
  "http://127.0.0.1:5001/translate";

const TRANSLATION_TIMEOUT = 60000;

// =====================================
// TRANSLATE SINGLE TEXT
// =====================================

const translateText = async (
  text,
  target = "hi"
) => {
  // Empty text translate karne ki zarurat nahi
  if (
    typeof text !== "string" ||
    !text.trim()
  ) {
    return "";
  }

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, TRANSLATION_TIMEOUT);

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

        signal: controller.signal,
      }
    );

    const responseText =
      await response.text();

    let data = {};

    // Safely parse JSON response
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          "Translation service returned an invalid response."
        );
      }
    }

    // Translation service error
    if (!response.ok) {
      throw new Error(
        data?.error ||
        `Translation request failed with status ${response.status}.`
      );
    }

    // Validate response
    if (
      !data?.translatedText ||
      typeof data.translatedText !==
        "string"
    ) {
      throw new Error(
        "Translation service returned an invalid translation."
      );
    }

    return data.translatedText;

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error.name === "AbortError") {
      throw new ApiError(
        504,
        "Translation service request timed out."
      );
    }

    throw new ApiError(
      502,
      `Question translation failed: ${error.message}`
    );

  } finally {
    clearTimeout(timeoutId);
  }
};


// =====================================
// TRANSLATE COMPLETE QUESTION
// =====================================

const translateQuestionToHindi =
  async (questionData) => {

    // Sequential requests
    // Free Render instance par simultaneous
    // requests avoid karne ke liye.

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