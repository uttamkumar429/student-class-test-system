import OptionList from "./OptionList";

const QuestionCard = ({
  question,
  questionNumber = 1,
  totalQuestions = 0,
  selectedAnswer,
  onOptionSelect,
}) => {
  // ======================================
  // EMPTY QUESTION
  // ======================================

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
  // BUILD OPTIONS
  // ======================================
  //
  // Production backend returns:
  // optionA, optionB, optionC, optionD
  //
  // Older UI architecture may return:
  // options[]
  //
  // Support both formats safely.
  // ======================================

  const optionsFromBackend = [
    {
      key: "A",
      text: question.optionA,
    },
    {
      key: "B",
      text: question.optionB,
    },
    {
      key: "C",
      text: question.optionC,
    },
    {
      key: "D",
      text: question.optionD,
    },
  ];

  const optionsFromArray = Array.isArray(
    question.options
  )
    ? question.options
        .map((option, index) => ({
          key:
            option?.key ??
            option?.value ??
            String.fromCharCode(65 + index),

          text:
            option?.text ??
            option?.label ??
            option?.optionText ??
            option?.value ??
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

  const backendOptions =
    optionsFromBackend.filter(
      (option) =>
        typeof option.text === "string" &&
        option.text.trim() !== ""
    );

  const options =
    backendOptions.length > 0
      ? backendOptions
      : optionsFromArray;

  // ======================================
  // QUESTION TEXT
  // ======================================

  const questionText =
    question.question ??
    question.questionText ??
    "";

  // ======================================
  // QUESTION IMAGE
  // ======================================

  const questionImage =
    question.questionImage ??
    question.image ??
    null;

  // ======================================
  // RENDER
  // ======================================

  return (
    <article
      aria-label={`Question ${questionNumber}`}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {/* ==================================
          HEADER
      ================================== */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            Question {questionNumber} of{" "}
            {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            {question.marks ?? 0} Marks
          </span>
        </div>
      </div>

      {/* ==================================
          QUESTION
      ================================== */}

      <div className="mb-6">
        <p className="whitespace-pre-wrap text-lg leading-8 text-slate-800">
          {questionText}
        </p>
      </div>

      {/* ==================================
          QUESTION IMAGE
      ================================== */}

      {questionImage && (
        <div className="mb-6">
          <img
            src={questionImage}
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

      {/* ==================================
          OPTIONS
      ================================== */}

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