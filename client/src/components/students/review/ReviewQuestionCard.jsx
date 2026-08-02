import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  CheckCircle2,
  XCircle,
  Award,
  Layers,
} from "lucide-react";

import {
  selectCurrentQuestion,
  selectCurrentQuestionIndex,
  selectQuestions,
} from "../../../redux/studentReview/reviewSelectors";

import ExplanationCard from "./ExplanationCard";
import ReviewOptionList from "./ReviewOptionList";
import { useEffect } from "react";
function ReviewQuestionCard() {
  const question = useSelector(selectCurrentQuestion);

  const currentQuestionIndex = useSelector(
    selectCurrentQuestionIndex
  );

  const questions = useSelector(selectQuestions);

   useEffect(() => {

        window.scrollTo({

            top: 0,

            behavior: "smooth",

        });

    }, [currentQuestionIndex]);

  if (!question) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-md">
        <h2 className="text-xl font-semibold text-slate-600">
          No Question Found
        </h2>
      </div>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-8 shadow-md">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">

            Question

          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">

            {currentQuestionIndex + 1} / {questions.length}

          </h2>

        </div>

        <div className="flex flex-wrap gap-3">

          <Badge
            icon={<Layers size={16} />}
            title={question.difficulty}
            color="bg-blue-100 text-blue-700"
          />

          <Badge
            icon={<Award size={16} />}
            title={`${question.marks} Marks`}
            color="bg-orange-100 text-orange-700"
          />

          <Badge
            icon={
              question.isCorrect ? (
                <CheckCircle2 size={16} />
              ) : (
                <XCircle size={16} />
              )
            }
            title={
              question.isCorrect
                ? "Correct"
                : question.selectedAnswer
                ? "Wrong"
                : "Skipped"
            }
            color={
              question.isCorrect
                ? "bg-green-100 text-green-700"
                : question.selectedAnswer
                ? "bg-red-100 text-red-700"
                : "bg-slate-200 text-slate-700"
            }
          />

        </div>

      </div>

      {/* Question */}

      <div className="mt-8">

        <p className="text-lg leading-8 text-slate-800">

          {question.question}

        </p>

      </div>

      {/* Future Image Support */}

      {question.questionImage && (

        <div className="mt-6">

          <img
            src={question.questionImage}
            alt="Question"
            className="max-h-96 rounded-xl border"
          />

        </div>

      )}

      {/* Options */}

      <div className="mt-8">

        <ReviewOptionList
          options={question.options}
          selectedAnswer={question.selectedAnswer}
          correctAnswer={question.correctAnswer}
        />

      </div>

      {/* Explanation */}

      <div className="mt-8">

        <ExplanationCard
          explanation={question.explanation}
        />

      </div>

    </section>
  );
}

function Badge({
  icon,
  title,
  color,
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${color}`}
    >
      {icon}

      {title}
    </div>
  );
}

Badge.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default ReviewQuestionCard;