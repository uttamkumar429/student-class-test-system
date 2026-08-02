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

  const questions = useSelector(selectQuestions);

  const totalQuestions = questions.length;

  const isFirstQuestion =
    currentQuestionIndex === 0;

  const isLastQuestion =
    currentQuestionIndex === totalQuestions - 1;

  const handlePrevious = useCallback(() => {
    if (isFirstQuestion) return;

    dispatch(
      setCurrentQuestion(currentQuestionIndex - 1)
    );
  }, [
    dispatch,
    currentQuestionIndex,
    isFirstQuestion,
  ]);

  const handleNext = useCallback(() => {
    if (isLastQuestion) return;

    dispatch(
      setCurrentQuestion(currentQuestionIndex + 1)
    );
  }, [
    dispatch,
    currentQuestionIndex,
    isLastQuestion,
  ]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        handlePrevious();
      }

      if (event.key === "ArrowRight") {
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
  }, [handlePrevious, handleNext]);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-md">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Back */}

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          <ArrowLeft size={18} />

          Back to Results
        </button>

        {/* Counter */}

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
            Keyboard:
            ← Previous | → Next
          </p>

        </div>

        {/* Navigation */}

        <div className="flex gap-3">

          <button
            type="button"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-5 py-3 font-semibold transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={18} />

            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isLastQuestion}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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