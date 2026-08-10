import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  selectCurrentQuestionIndex,
  selectQuestions,
} from "../../../redux/studentReview/reviewSelectors";

import {
  setCurrentQuestion,
} from "../../../redux/studentReview/reviewSlice";

function ReviewNavigation({ onBack }) {
  const dispatch = useDispatch();

  const currentQuestionIndex = useSelector(
    selectCurrentQuestionIndex
  );

  const questions = useSelector(
    selectQuestions
  );

  const totalQuestions = questions.length;

  // ======================================
  // NAVIGATION STATE
  // ======================================

  const isFirstQuestion =
    totalQuestions === 0 ||
    currentQuestionIndex <= 0;

  const isLastQuestion =
    totalQuestions === 0 ||
    currentQuestionIndex >= totalQuestions - 1;

  // ======================================
  // PREVIOUS
  // ======================================

  const handlePrevious = useCallback(() => {
    if (isFirstQuestion) return;

    dispatch(
      setCurrentQuestion(
        currentQuestionIndex - 1
      )
    );
  }, [
    dispatch,
    currentQuestionIndex,
    isFirstQuestion,
  ]);

  // ======================================
  // NEXT
  // ======================================

  const handleNext = useCallback(() => {
    if (isLastQuestion) return;

    dispatch(
      setCurrentQuestion(
        currentQuestionIndex + 1
      )
    );
  }, [
    dispatch,
    currentQuestionIndex,
    isLastQuestion,
  ]);

  // ======================================
  // KEYBOARD NAVIGATION
  // ======================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        )
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    handlePrevious,
    handleNext,
  ]);

  // ======================================
  // EMPTY STATE
  // ======================================

  if (!totalQuestions) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-500">
            No review questions available.
          </p>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ArrowLeft size={18} />

            Back to Results
          </button>

        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* ======================================
            BACK
        ====================================== */}

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ArrowLeft size={18} />

          Back to Results
        </button>

        {/* ======================================
            COUNTER
        ====================================== */}

        <div className="text-center">

          <p className="text-sm text-slate-500">
            Reviewing Question
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-800">
            {currentQuestionIndex + 1}

            <span className="mx-2 text-slate-400">
              /
            </span>

            {totalQuestions}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Keyboard: ← Previous | → Next
          </p>

        </div>

        {/* ======================================
            NAVIGATION
        ====================================== */}

        <div className="flex justify-center gap-3">

          <button
            type="button"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            aria-label="Previous question"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-5 py-3 font-semibold transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ChevronLeft size={18} />

            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isLastQuestion}
            aria-label="Next question"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Next

            <ChevronRight size={18} />

          </button>

        </div>

      </div>

    </section>
  );
}

export default ReviewNavigation;