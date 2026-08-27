const ApiError = require("../utils/ApiError");

// =====================================
// LIBRETRANSLATE CONFIGURATION
// =====================================

const TRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL ||
  "http://127.0.0.1:5001/translate";

// =====================================
// TRANSLATE SINGLE TEXT
// =====================================

const translateText = async (
  text,
  target = "hi"
) => {
  // Empty text ko translate karne ki
  // zarurat nahi hai.
  if (
    typeof text !== "string" ||
    !text.trim()
  ) {
    return "";
  }

  try {
    const response = await fetch(
      TRANSLATE_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          q: text.trim(),
          source: "en",
          target,
          format: "text",
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
        "Translation request failed."
      );
    }

    if (
      !data?.translatedText ||
      typeof data.translatedText !==
        "string"
    ) {
      throw new Error(
        "Invalid translation response."
      );
    }

    return data.translatedText;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      502,
      `Question translation failed: ${error.message}`
    );
  }
};

// =====================================
// TRANSLATE COMPLETE QUESTION
// =====================================

const translateQuestionToHindi =
  async (questionData) => {
    const [
      questionHindi,
      optionAHindi,
      optionBHindi,
      optionCHindi,
      optionDHindi,
      explanationHindi,
    ] = await Promise.all([
      translateText(
        questionData.question
      ),

      translateText(
        questionData.optionA
      ),

      translateText(
        questionData.optionB
      ),

      translateText(
        questionData.optionC
      ),

      translateText(
        questionData.optionD
      ),

      translateText(
        questionData.explanation || ""
      ),
    ]);

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