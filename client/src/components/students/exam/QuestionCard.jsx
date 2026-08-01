import OptionList from "./OptionList";

const QuestionCard = ({
  question,
  questionNumber = 1,
  totalQuestions = 0,
  selectedAnswer,
  onOptionSelect,
}) => {
  if (!question) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-700">
            No Question Available
          </h2>

          <p className="mt-2 text-slate-500">
            Unable to load the current question.
          </p>
        </div>
      </div>
    );
  }

  return (
    <article
      aria-label={`Question ${questionNumber}`}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            Question {questionNumber} of {totalQuestions}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <span className="rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            {question.marks} Marks
          </span>

        </div>

      </div>

      {/* Question */}

      <div className="mb-6">

        <p className="whitespace-pre-wrap text-lg leading-8 text-slate-800">
          {question.questionText}
        </p>

      </div>

      {/* Question Image */}

      {question.questionImage && (
        <div className="mb-6">

          <img
            src={question.questionImage}
            alt={`Question ${questionNumber}`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="max-h-96 w-full rounded-lg border border-slate-200 object-contain"
          />

        </div>
      )}

      {/* Options */}

      <OptionList
        options={question.options || []}
        selectedAnswer={selectedAnswer}
        onOptionSelect={onOptionSelect}
      />

    </article>
  );
};

export default QuestionCard;