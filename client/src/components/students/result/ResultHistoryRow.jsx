import { useNavigate } from "react-router-dom";

function ResultHistoryRow({ result }) {
  const navigate = useNavigate();

  const {
    attemptId,
    examTitle,
    subject,
    obtainedMarks,
    totalMarks,
    percentage,
    status,
    submittedAt,
  } = result;

  const formattedDate = submittedAt
    ? new Date(submittedAt).toLocaleDateString()
    : "-";
    const isPassed = status?.toLowerCase() === "pass";

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 font-medium text-gray-900">
        {examTitle}
      </td>

      <td className="px-6 py-4 text-gray-700">
        {subject}
      </td>

      <td className="px-6 py-4 text-center text-gray-700">
        {obtainedMarks} / {totalMarks}
      </td>

      <td className="px-6 py-4 text-center font-semibold">
        {percentage}%
      </td>

      <td className="px-6 py-4 text-center">
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            isPassed
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
        >
          {status}
        </span>
      </td>

      <td className="px-6 py-4 text-center text-gray-600">
        {formattedDate}
      </td>

      <td className="px-6 py-4 text-center">
        <button
          type="button"
          onClick={() => navigate(`/student/result/${attemptId}`)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          View Result
        </button>
      </td>
    </tr>
  );
}

export default ResultHistoryRow;