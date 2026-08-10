const STATUS_COLORS = Object.freeze({
  NOT_VISITED:
    "bg-slate-200 text-slate-700",

  VISITED:
    "bg-red-500 text-white",

  ANSWERED:
    "bg-green-600 text-white",

  REVIEW:
    "bg-purple-600 text-white",

  ANSWERED_REVIEW:
    "bg-orange-500 text-white",
});

const LEGEND = [
  {
    color: "bg-slate-200",
    label: "Not Visited",
  },
  {
    color: "bg-red-500",
    label: "Visited",
  },
  {
    color: "bg-green-600",
    label: "Answered",
  },
  {
    color: "bg-purple-600",
    label: "Marked for Review",
  },
  {
    color: "bg-orange-500",
    label: "Answered & Review",
  },
];

const QuestionPalette = ({
  questions = [],
  currentQuestionIndex = 0,
  visitedQuestions = {},
  selectedAnswers = {},
  reviewQuestions = {},
  onQuestionClick,
}) => {
  // ======================================
  // GET QUESTION ID
  // ======================================

  const getQuestionId = (question) => {
    return (
      question?.questionId ||
      question?._id ||
      null
    );
  };

  // ======================================
  // GET QUESTION STATUS
  // ======================================

  const getQuestionStatus = (
    questionId
  ) => {
    if (!questionId) {
      return "NOT_VISITED";
    }

    const visited =
      !!visitedQuestions?.[questionId];

    const answered =
      !!selectedAnswers?.[questionId];

    const review =
      !!reviewQuestions?.[questionId];

    if (!visited) {
      return "NOT_VISITED";
    }

    if (review && answered) {
      return "ANSWERED_REVIEW";
    }

    if (review) {
      return "REVIEW";
    }

    if (answered) {
      return "ANSWERED";
    }

    return "VISITED";
  };

  // ======================================
  // EMPTY STATE
  // ======================================

  if (!questions.length) {
    return (
      <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Question Palette
        </h2>

        <div className="mt-6 text-center text-slate-500">
          No Questions Available
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Heading */}

      <h2 className="mb-5 text-lg font-semibold text-slate-800">
        Question Palette
      </h2>

      {/* Question Numbers */}

      <div className="grid grid-cols-5 gap-3">
        {questions.map(
          (question, index) => {
            const questionId =
              getQuestionId(question);

            const status =
              getQuestionStatus(
                questionId
              );

            const isCurrent =
              currentQuestionIndex ===
              index;

            return (
              <button
                key={
                  questionId ||
                  `question-${index}`
                }
                type="button"
                title={`Question ${
                  index + 1
                }`}
                aria-label={`Question ${
                  index + 1
                }${
                  isCurrent
                    ? ", current question"
                    : ""
                }`}
                aria-current={
                  isCurrent
                    ? "step"
                    : undefined
                }
                onClick={() =>
                  onQuestionClick?.(
                    index
                  )
                }
                className={`
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-lg
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  hover:scale-105
                  hover:shadow-md

                  ${
                    STATUS_COLORS[
                      status
                    ]
                  }

                  ${
                    isCurrent
                      ? "scale-105 ring-2 ring-blue-600 ring-offset-2"
                      : ""
                  }
                `}
              >
                {index + 1}
              </button>
            );
          }
        )}
      </div>

      {/* Legend */}

      <div className="mt-8 border-t border-slate-200 pt-5">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Legend
        </h3>

        <div className="space-y-2">
          {LEGEND.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className={`h-4 w-4 rounded ${item.color}`}
              />

              <span className="text-sm text-slate-600">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default QuestionPalette;