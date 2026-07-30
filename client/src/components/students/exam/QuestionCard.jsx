import OptionList from "./OptionList";

const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onOptionSelect,
}) => {
  if (!question) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="text-center text-gray-500">
          No Question Available
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Question {questionNumber} / {totalQuestions}
        </h2>

        <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          {question.marks} Marks
        </span>
      </div>

      {/* Question */}
      <p className="mb-6 text-lg leading-7">
        {question.questionText}
      </p>

      {/* Future Image Support */}
      {question.questionImage && (
        <img
          src={question.questionImage}
          alt="Question"
          className="mb-6 max-h-80 rounded-lg"
        />
      )}

      {/* Options */}
      <OptionList
        options={question.options}
        selectedAnswer={selectedAnswer}
        onOptionSelect={onOptionSelect}
      />

    </div>
  );
};

export default QuestionCard;