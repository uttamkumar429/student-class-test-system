import PropTypes from "prop-types";
import {
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

function QuestionRow({
  index,
  question,
  onPreview,
  onEdit,
  onDelete,
}) {
  const difficultyStyles = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <tr className="border-b transition-colors hover:bg-slate-50">

      {/* Serial Number */}

      <td className="px-5 py-4 text-center font-medium text-slate-600">
        {index + 1}
      </td>

      {/* Subject */}

      <td className="px-5 py-4">
        {question.subject}
      </td>

      {/* Chapter */}

      <td className="px-5 py-4">
        {question.chapter}
      </td>

      {/* Question */}

      <td className="max-w-md px-5 py-4">
        <p
          className="truncate"
          title={question.question}
        >
          {question.question}
        </p>
      </td>

      {/* Difficulty */}

      <td className="px-5 py-4 text-center">

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            difficultyStyles[
              question.difficulty
            ]
          }`}
        >
          {question.difficulty}
        </span>

      </td>

      {/* Marks */}

      <td className="px-5 py-4 text-center font-semibold">
        {question.marks}
      </td>

      {/* Actions */}

      <td className="px-5 py-4">

        <div className="flex items-center justify-center gap-3">

          {/* Preview */}

          <button
            type="button"
            aria-label="Preview Question"
            onClick={() =>
              onPreview(question)
            }
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
          >
            <Eye size={18} />
          </button>

          {/* Edit */}

          <button
            type="button"
            aria-label="Edit Question"
            onClick={() =>
              onEdit(question)
            }
            className="rounded-lg p-2 text-slate-600 transition hover:bg-blue-100 hover:text-blue-700"
          >
            <Pencil size={18} />
          </button>

          {/* Delete */}

          <button
            type="button"
            aria-label="Delete Question"
            onClick={() =>
              onDelete(question)
            }
            className="rounded-lg p-2 text-slate-600 transition hover:bg-red-100 hover:text-red-700"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </td>

    </tr>
  );
}

QuestionRow.propTypes = {
  index: PropTypes.number.isRequired,

  question: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    chapter: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    difficulty: PropTypes.oneOf([
      "Easy",
      "Medium",
      "Hard",
    ]).isRequired,
    marks: PropTypes.number.isRequired,
  }).isRequired,

  onPreview: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default QuestionRow;