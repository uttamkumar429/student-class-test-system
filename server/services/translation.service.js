const ApiError = require("../utils/ApiError");

const TRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL ||
  "https://libretranslate-sj86.onrender.com/translate";

const TRANSLATION_TIMEOUT = 90000;
const MAX_RETRIES = 5;

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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

  let lastError;

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    const controller =
      new AbortController();

    const timeoutId = setTimeout(
      () => controller.abort(),
      TRANSLATION_TIMEOUT
    );

    try {
      console.log(
        `Translation attempt ${attempt}/${MAX_RETRIES}`
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

      console.log(
        `Translation response status: ${response.status}`
      );

      if (!response.ok) {
        throw new Error(
          `Translation request failed with status ${response.status}: ${responseText.slice(
            0,
            300
          )}`
        );
      }

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Translation service returned invalid JSON: ${responseText.slice(
            0,
            300
          )}`
        );
      }

      if (
        !data ||
        typeof data.translatedText !==
          "string" ||
        !data.translatedText.trim()
      ) {
        throw new Error(
          "Translation service returned an invalid response."
        );
      }

      console.log(
        `Translation successful on attempt ${attempt}`
      );

      return data.translatedText;

    } catch (error) {
      lastError = error;

      console.error(
        `Translation attempt ${attempt}/${MAX_RETRIES} failed:`,
        error.message
      );

      if (attempt < MAX_RETRIES) {
        const waitTime =
          attempt * 5000;

        console.log(
          `Waiting ${waitTime}ms before retry...`
        );

        await delay(waitTime);
      }

    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw new ApiError(
    502,
    `Question translation failed after ${MAX_RETRIES} attempts: ${lastError?.message}`
  );
};

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

module.exports = {
  translateText,
  translateQuestionToHindi,
};