import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Send,
} from "lucide-react";

const ExamNavigation = ({
  currentQuestionIndex,
  totalQuestions,

  isFirstQuestion,
  isLastQuestion,

  isMarkedForReview,

  onPrevious,
  onNext,
  onToggleReview,
  onSubmit,

  loading = false,
}) => {
  return (
    <div className="sticky bottom-0 z-30 rounded-xl border border-slate-200 bg-white p-5 shadow-md">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Previous */}

        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstQuestion || loading}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-slate-200
            px-5
            py-3
            font-medium
            transition
            hover:bg-slate-300
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <ChevronLeft size={18} />

          Previous
        </button>

        {/* Center */}

        <div className="flex flex-wrap items-center justify-center gap-3">

          <button
            type="button"
            onClick={onToggleReview}
            disabled={loading}
            className={`
              flex
              items-center
              gap-2
              rounded-lg
              px-5
              py-3
              font-medium
              transition

              ${
                isMarkedForReview
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }

              ${
                loading
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }
            `}
          >
            <Bookmark size={18} />

            {isMarkedForReview
              ? "Marked for Review"
              : "Mark for Review"}
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-red-600
              px-5
              py-3
              font-medium
              text-white
              transition
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <Send size={18} />

            Submit Exam
          </button>

        </div>

        {/* Next */}

        <button
          type="button"
          onClick={onNext}
          disabled={isLastQuestion || loading}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-blue-600
            px-5
            py-3
            font-medium
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Next

          <ChevronRight size={18} />
        </button>

      </div>

      {/* Progress */}

      <div className="mt-5 border-t border-slate-200 pt-4">

        <p className="text-center text-sm text-slate-500">

          Question{" "}
          <span className="font-semibold text-slate-700">
            {currentQuestionIndex + 1}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {totalQuestions}
          </span>

        </p>

      </div>

    </div>
  );
};

export default ExamNavigation;