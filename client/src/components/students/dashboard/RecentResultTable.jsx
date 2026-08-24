import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function RecentResults({ results = [] }) {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleViewResult = (attemptId) => {
    navigate(`/student/result/${attemptId}`);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Recent Results
          </h2>

         <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your latest examination performance.
          </p>
        </div>
      </div>

      {/* Empty State */}

      {results.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            No Results Yet
          </h3>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your completed examination results will appear here.
          </p>
        </div>
      ) : (
        /* Table */

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/70">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Exam
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Subject
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Date
                </th>

                <th className="px-6 py-4 text-lefttext-sm font-semibold text-slate-600 dark:text-slate-300">
                  Marks
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Score
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {results.map((result) => (
                <tr
                  key={result.attemptId}
                  className="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
                >
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">
                    {result.examTitle || "Unknown Exam"}
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {result.subject || "Unknown Subject"}
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {formatDate(result.submittedAt)}
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {result.obtainedMarks ?? 0}
                    </span>

                    <span className="text-slate-500 dark:text-slate-400">
                      /{result.totalMarks ?? 0}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {Number(result.percentage ?? 0).toFixed(2)}%
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        handleViewResult(result.attemptId)
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

RecentResults.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      attemptId: PropTypes.string.isRequired,
      examTitle: PropTypes.string,
      subject: PropTypes.string,
      obtainedMarks: PropTypes.number,
      totalMarks: PropTypes.number,
      percentage: PropTypes.number,
      submittedAt: PropTypes.string,
    })
  ),
};

RecentResults.defaultProps = {
  results: [],
};

export default RecentResults;