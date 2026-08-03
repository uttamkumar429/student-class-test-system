import PropTypes from "prop-types";

function QuestionSelectorTable({
  questions,
  selectedQuestions,
  onToggleQuestion,
}) {
  // Empty State

  if (!questions.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-slate-700">
          No Questions Found
        </h3>

        <p className="mt-2 text-slate-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <table className="min-w-full">

        {/* ===========================
            Header
        =========================== */}

        <thead className="bg-slate-100">

          <tr>

            <th className="w-16 px-5 py-4 text-center">
              Select
            </th>

            <th className="px-5 py-4 text-left">
              Question
            </th>

            <th className="px-5 py-4 text-center">
              Subject
            </th>

            <th className="px-5 py-4 text-center">
              Difficulty
            </th>

            <th className="px-5 py-4 text-center">
              Marks
            </th>

          </tr>

        </thead>

        {/* ===========================
            Body
        =========================== */}

        <tbody>

          {questions.map((question) => {

            const checked =
              selectedQuestions.includes(
                question._id
              );

            return (

              <tr
                key={question._id}
                className={`border-t transition hover:bg-slate-50 ${
                  checked
                    ? "bg-blue-50"
                    : ""
                }`}
              >

                {/* Checkbox */}

                <td className="px-5 py-5 text-center">

                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      onToggleQuestion(
                        question._id
                      )
                    }
                    className="h-5 w-5 cursor-pointer rounded"
                  />

                </td>

                {/* Question */}

                <td className="max-w-xl px-5 py-5">

                  <p className="font-medium text-slate-800">

                    {question.question}

                  </p>

                  <p className="mt-2 text-sm text-slate-500">

                    {question.chapter}

                  </p>

                </td>

                {/* Subject */}

                <td className="px-5 py-5 text-center">

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

                    {question.subject}

                  </span>

                </td>

                {/* Difficulty */}

                <td className="px-5 py-5 text-center">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold
                    ${
                      question.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : question.difficulty ===
                          "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    {question.difficulty}

                  </span>

                </td>

                {/* Marks */}

                <td className="px-5 py-5 text-center">

                  <span className="font-semibold text-slate-700">

                    {question.marks}

                  </span>

                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>
  );
}

QuestionSelectorTable.propTypes = {
  questions: PropTypes.array.isRequired,
  selectedQuestions: PropTypes.array.isRequired,
  onToggleQuestion: PropTypes.func.isRequired,
};

export default QuestionSelectorTable;