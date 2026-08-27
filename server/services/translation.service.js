const ApiError = require("../utils/ApiError");

// =====================================
// LIBRETRANSLATE CONFIGURATION
// =====================================

const TRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL ||
  "http://127.0.0.1:5001/translate";

const TRANSLATION_TIMEOUT = 30000;

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
  if (
    typeof text !== "string" ||
    !text.trim()
  ) {
    return "";
  }

  const MAX_RETRIES = 3;

  let lastError;

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    const controller =
      new AbortController();

    const timeoutId =
      setTimeout(
        () => controller.abort(),
        TRANSLATION_TIMEOUT
      );

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

          signal:
            controller.signal,
        }
      );

      const responseText =
        await response.text();

      let data;

      try {
        data = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        throw new Error(
          `Translation service returned invalid JSON.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
          `Translation request failed with status ${response.status}.`
        );
      }

      if (
        !data?.translatedText ||
        typeof data.translatedText !==
          "string"
      ) {
        throw new Error(
          "Translation service returned an invalid response."
        );
      }

      return data.translatedText;

    } catch (error) {
      lastError = error;

      console.error(
        `Translation attempt ${attempt}/${MAX_RETRIES} failed:`,
        error.message
      );

      if (attempt < MAX_RETRIES) {
        await delay(
          attempt * 2000
        );
      }

    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw new ApiError(
    502,
    `Question translation failed: ${lastError?.message}`
  );
};

// =====================================
// TRANSLATE COMPLETE QUESTION
// SEQUENTIAL REQUESTS
// =====================================

const translateQuestionToHindi = async (
  questionData
) => {
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