import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import {
  selectCurrentQuestionIndex,
  selectQuestions,
  selectReview,
} from "../../../redux/studentReview/reviewSelectors";

import { setCurrentQuestion } from "../../../redux/studentReview/reviewSlice";

const STATUS_COLORS = {
  CORRECT:
    "bg-green-600 text-white border-green-600",

  WRONG:
    "bg-red-600 text-white border-red-600",

  SKIPPED:
    "bg-slate-200 text-slate-700 border-slate-300",
};

function ReviewPalette() {
  const dispatch = useDispatch();

  const questions = useSelector(selectQuestions);
  const review = useSelector(selectReview);
  const currentQuestionIndex = useSelector(
    selectCurrentQuestionIndex
  );

  const getStatus = (question) => {
    if (!question.selectedAnswer) {
      return "SKIPPED";
    }

    return question.isCorrect
      ? "CORRECT"
      : "WRONG";
  };

  return (
    <aside className="rounded-2xl bg-white p-6 shadow-md">

      <h2 className="text-lg font-bold text-slate-800">
        Question Palette
      </h2>

      <div className="mt-6 grid grid-cols-5 gap-3">

        {questions.map((question, index) => {

          const status = getStatus(question);

          return (

            <button
              key={question.questionId}
              type="button"
              aria-label={`Question ${index + 1}`}
onClick={() => {
  dispatch(
    setCurrentQuestion(index)
  );

  const attemptId =
    review?.attemptId;

  if (attemptId) {
    localStorage.setItem(
      `reviewQuestionIndex_${attemptId}`,
      String(index)
    );
  }
}}
              className={`
                h-11
                w-11
                rounded-lg
                border
                font-semibold
                transition-all
                duration-200

                ${STATUS_COLORS[status]}

                ${
                  currentQuestionIndex === index
                    ? "ring-4 ring-blue-500 ring-offset-2 scale-105"
                    : "hover:scale-105"
                }
              `}
            >
              {index + 1}
            </button>

          );
        })}

      </div>

      {/* Legend */}

      <div className="mt-8 space-y-3">

        <Legend
          color="bg-green-600"
          text="Correct"
        />

        <Legend
          color="bg-red-600"
          text="Wrong"
        />

        <Legend
          color="bg-slate-300"
          text="Skipped"
        />

      </div>

    </aside>
  );
}

function Legend({
  color,
  text,
}) {
  return (
    <div className="flex items-center gap-3">

      <span
        className={`h-4 w-4 rounded ${color}`}
      />

      <span className="text-sm text-slate-600">
        {text}
      </span>

    </div>
  );
}

Legend.propTypes = {
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

ReviewPalette.propTypes = {};

export default ReviewPalette;