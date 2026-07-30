const ExamNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  isMarkedForReview,
  onPrevious,
  onNext,
  onToggleReview,
  onSubmit,
}) => {
  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      {/* Previous */}
      <button
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        className="rounded-md bg-gray-200 px-5 py-2 font-medium transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ← Previous
      </button>

      {/* Center Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleReview}
          className={`rounded-md px-5 py-2 font-medium transition ${
            isMarkedForReview
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-purple-100 text-purple-700 hover:bg-purple-200"
          }`}
        >
          {isMarkedForReview
            ? "✓ Review Marked"
            : "Mark For Review"}
        </button>

        <button
          onClick={onSubmit}
          className="rounded-md bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700"
        >
          Submit Exam
        </button>
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={currentQuestionIndex === totalQuestions - 1}
        className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next →
      </button>
    </div>
  );
};

export default ExamNavigation;