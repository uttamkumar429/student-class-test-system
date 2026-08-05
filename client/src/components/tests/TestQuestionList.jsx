import {
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

function TestQuestionList({ questions = [] }) {
  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

        <HelpCircle
          size={52}
          className="mx-auto text-slate-300"
        />

        <h3 className="mt-4 text-xl font-semibold text-slate-700">
          No Questions Found
        </h3>

        <p className="mt-2 text-slate-500">
          This test does not contain any questions.
        </p>

      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}

      <div className="border-b border-slate-200 p-6">

        <h2 className="text-xl font-bold text-slate-800">
          Questions
        </h2>

        <p className="mt-1 text-slate-500">
          Total Questions : {questions.length}
        </p>

      </div>

      <div className="divide-y divide-slate-200">

        {questions.map((question, index) => (

          <div
            key={question._id}
            className="p-6"
          >

            {/* Top */}

            <div className="mb-4 flex items-center justify-between">

              <h3 className="text-lg font-semibold text-slate-800">
                Question {index + 1}
              </h3>

              <div className="flex gap-2">

                <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {question.subject}
                </span>

                <span className="rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                  {question.chapter}
                </span>

                <span className="rounded-lg bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                  {question.difficulty}
                </span>

              </div>

            </div>

            {/* Question */}

            <p className="leading-7 text-slate-700">

              {question.question}

            </p>

            {/* Options */}

            <div className="mt-5 grid gap-3 md:grid-cols-2">

              <Option
                label="A"
                value={question.optionA}
                correct={
                  question.correctAnswer ===
                  "A"
                }
              />

              <Option
                label="B"
                value={question.optionB}
                correct={
                  question.correctAnswer ===
                  "B"
                }
              />

              <Option
                label="C"
                value={question.optionC}
                correct={
                  question.correctAnswer ===
                  "C"
                }
              />

              <Option
                label="D"
                value={question.optionD}
                correct={
                  question.correctAnswer ===
                  "D"
                }
              />

            </div>

            {/* Bottom */}

            <div className="mt-5 flex items-center justify-between">

              <div className="rounded-lg bg-green-50 px-4 py-2 text-green-700">

                Marks :
                <span className="ml-2 font-semibold">

                  {question.marks}

                </span>

              </div>

              {question.explanation && (

                <div className="text-sm text-slate-500">

                  Explanation Available

                </div>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

function Option({
  label,
  value,
  correct,
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 transition ${
        correct
          ? "border-green-400 bg-green-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div>

        <p className="font-semibold">

          {label}.

        </p>

        <p className="mt-1 text-slate-700">

          {value}

        </p>

      </div>

      {correct && (

        <CheckCircle2
          className="text-green-600"
          size={22}
        />

      )}

    </div>
  );
}

export default TestQuestionList;