const STATUS_COLORS = {
  NOT_VISITED: "bg-gray-300 text-gray-700",
  VISITED: "bg-red-500 text-white",
  ANSWERED: "bg-green-600 text-white",
  REVIEW: "bg-purple-600 text-white",
  ANSWERED_REVIEW: "bg-orange-500 text-white",
};

const QuestionPalette = ({
  questions,
  currentQuestionIndex,
  visitedQuestions,
  selectedAnswers,
  reviewQuestions,
  onQuestionClick,
}) => {
  const getQuestionStatus = (questionId) => {
    const visited = visitedQuestions[questionId];
    const answered = !!selectedAnswers[questionId];
    const review = reviewQuestions[questionId];

    if (!visited) return "NOT_VISITED";
    if (review && answered) return "ANSWERED_REVIEW";
    if (review) return "REVIEW";
    if (answered) return "ANSWERED";

    return "VISITED";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h2 className="text-lg font-semibold mb-4">
        Question Palette
      </h2>

      <div className="grid grid-cols-5 gap-3">
        {questions.map((question, index) => {
          const status = getQuestionStatus(question._id);

          return (
            <button
              key={question._id}
              onClick={() => onQuestionClick(index)}
              className={`
                h-11
                w-11
                rounded-md
                font-semibold
                transition-all
                duration-200
                ${STATUS_COLORS[status]}
                ${
                  currentQuestionIndex === index
                    ? "ring-2 ring-blue-600 ring-offset-2"
                    : ""
                }
              `}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-gray-300"></span>
          <span>Not Visited</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-red-500"></span>
          <span>Visited</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-green-600"></span>
          <span>Answered</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-purple-600"></span>
          <span>Marked for Review</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-orange-500"></span>
          <span>Answered & Review</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionPalette;