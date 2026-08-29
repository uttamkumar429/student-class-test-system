import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  CheckCircle2,
  XCircle,
  Award,
  Layers,
  CircleDashed,
  Clock,
} from "lucide-react";

import {
  selectCurrentQuestion,
  selectCurrentQuestionIndex,
  selectQuestions,
} from "../../../redux/studentReview/reviewSelectors";

import ExplanationCard from "./ExplanationCard";
import ReviewOptionList from "./ReviewOptionList";
const formatTimeSpent = (totalSeconds = 0) => {
  const seconds = Math.max(
    0,
    Number(totalSeconds) || 0
  );

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
};

function ReviewQuestionCard() {
  const question = useSelector(
    selectCurrentQuestion
  );

  const currentQuestionIndex = useSelector(
    selectCurrentQuestionIndex
  );

  const questions = useSelector(
    selectQuestions
  );
  const [language, setLanguage] =
  useState("english");

  // ======================================
  // SCROLL TO TOP ON QUESTION CHANGE
  // ======================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentQuestionIndex]);

  // ======================================
  // EMPTY STATE
  // ======================================

  if (!question) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">
          No Question Found
        </h2>

        <p className="mt-2 text-slate-500">
          The selected review question could not be found.
        </p>
      </section>
    );
  }

  const isCorrect =
    question.isCorrect === true;

  const isAnswered =
    Boolean(question.selectedAnswer);

  const resultTitle = isCorrect
    ? "Correct"
    : isAnswered
    ? "Wrong"
    : "Skipped";

  const resultColor = isCorrect
    ? "bg-green-100 text-green-700"
    : isAnswered
    ? "bg-red-100 text-red-700"
    : "bg-slate-200 text-slate-700";

  const resultIcon = isCorrect ? (
    <CheckCircle2 size={16} />
  ) : isAnswered ? (
    <XCircle size={16} />
  ) : (
    <CircleDashed size={16} />
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Question
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {currentQuestionIndex + 1} /{" "}
            {questions.length}
          </h2>

        </div>
          <div className="relative">
            <label
              htmlFor="review-language"
              className="sr-only"
            >
              Language
            </label>

            <select
              id="review-language"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value)
              }
              className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="english">
                English
              </option>

              <option value="hindi">
                हिंदी
              </option>
            </select>

            <span
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base"
              aria-hidden="true"
            >
              🌐
            </span>

            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            >
              ▾
            </span>
          </div>

        <div className="flex flex-wrap gap-3">

          <Badge
            icon={<Layers size={16} />}
            title={
              question.difficulty ||
              "General"
            }
            color="bg-blue-100 text-blue-700"
          />

          <Badge
            icon={<Award size={16} />}
            title={`${question.marks ?? 0} Marks`}
            color="bg-orange-100 text-orange-700"
          />
          <Badge
            icon={<Clock size={16} />}
            title={`${formatTimeSpent(
              question.timeSpent
            )}`}
            color="bg-purple-100 text-purple-700"
          />

          <Badge
            icon={resultIcon}
            title={resultTitle}
            color={resultColor}
          />

        </div>

      </div>

      {/* ======================================
          QUESTION
      ====================================== */}

      <div className="mt-8">

        <p className="whitespace-pre-wrap text-lg leading-8 text-slate-800">
          {language === "hindi" &&
          question.questionHindi
            ? question.questionHindi
            : question.question}
        </p>

      </div>

      {/* ======================================
          QUESTION IMAGE
      ====================================== */}

      {question.questionImage && (
        <div className="mt-6">

          <img
            src={question.questionImage}
            alt={`Question ${
              currentQuestionIndex + 1
            }`}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
            className="max-h-96 rounded-xl border border-slate-200 object-contain"
          />

        </div>
      )}

      {/* ======================================
          OPTIONS
      ====================================== */}

      <div className="mt-8">

        <ReviewOptionList
          options={(question.options || []).map(
            (option) => ({
              ...option,
              text:
                language === "hindi" &&
                option.textHindi
                  ? option.textHindi
                  : option.text,
            })
          )}
          selectedAnswer={
            question.selectedAnswer
          }
          correctAnswer={
            question.correctAnswer
          }
        />

      </div>

      {/* ======================================
          EXPLANATION
      ====================================== */}

      <div className="mt-8">

        <ExplanationCard
          explanation={
            language === "hindi" &&
            question.explanationHindi
              ? question.explanationHindi
              : question.explanation
          }
        />

      </div>

    </section>
  );
}

// ======================================
// BADGE
// ======================================

function Badge({
  icon,
  title,
  color,
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${color}`}
    >
      {icon}

      <span>{title}</span>
    </div>
  );
}

Badge.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default ReviewQuestionCard;