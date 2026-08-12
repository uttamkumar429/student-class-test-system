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
      <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
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

// ======================================
// BUILD OPTIONS FROM BACKEND RESPONSE
// ======================================

const options = Array.isArray(question.options)
  ? question.options
      .map((option, index) => ({
        key:
          option?.value ??
          option?.key ??
          String.fromCharCode(65 + index),

        text:
          option?.text ??
          option?.label ??
          option?.optionText ??
          "",
          
        image:
          option?.image ??
          option?.optionImage ??
          null,
      }))
      .filter(
        (option) =>
          typeof option.text === "string" &&
          option.text.trim() !== ""
      )
  : [];
console.log("RAW OPTIONS:", question?.options);
console.log("FINAL OPTIONS:", options);
  return (
    <article
      aria-label={`Question ${questionNumber}`}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            Question {questionNumber} of{" "}
            {totalQuestions}
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
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
            className="max-h-96 w-full rounded-lg border border-slate-200 object-contain"
          />
        </div>
      )}

      {/* Options */}

      {options.length > 0 ? (
        <OptionList
          options={options}
          selectedAnswer={selectedAnswer}
          onOptionSelect={onOptionSelect}
        />
      ) : (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          No options available for this question.
        </div>
      )}
    </article>
  );
};

export default QuestionCard;