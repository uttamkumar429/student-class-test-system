import { Pencil, Trash2 } from "lucide-react";

const QuestionTable = ({
  questions,
  loading,
  error,
  onEdit,
  onDelete,
}) => {
  // Loading State
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-slate-500">Loading questions...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Empty State
  if (questions.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-slate-500">
          No questions found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-4 py-3 text-left">
              Subject
            </th>

            <th className="px-4 py-3 text-left">
              Chapter
            </th>

            <th className="px-4 py-3 text-left">
              Question
            </th>

            <th className="px-4 py-3 text-center">
              Difficulty
            </th>

            <th className="px-4 py-3 text-center">
              Marks
            </th>

            <th className="px-4 py-3 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {questions.map((question) => (

            <tr
              key={question._id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-4 py-3">
                {question.subject}
              </td>

              <td className="px-4 py-3">
                {question.chapter}
              </td>

              <td className="max-w-sm px-4 py-3">

                <p className="line-clamp-2">

                  {question.question}

                </p>

              </td>

              <td className="px-4 py-3 text-center">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium
                  ${
                    question.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : question.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >

                  {question.difficulty}

                </span>

              </td>

              <td className="px-4 py-3 text-center">

                {question.marks}

              </td>

              <td className="px-4 py-3">

                <div className="flex items-center justify-center gap-3">

                  <button
                    onClick={() => onEdit(question)}
                    className="text-blue-600 hover:text-blue-800"
                  >

                    <Pencil size={18} />

                  </button>

                  <button
                    onClick={() => onDelete(question._id)}
                    className="text-red-600 hover:text-red-800"
                  >

                    <Trash2 size={18} />

                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default QuestionTable;