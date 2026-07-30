import ResultHistoryRow from "./ResultHistoryRow";

function ResultHistoryTable({ results }) {
  return (
    <section className="overflow-hidden rounded-xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Exam
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Subject
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Marks
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Percentage
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Submitted
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {results.map((result) => (
              <ResultHistoryRow
                key={result.attemptId}
                result={result}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ResultHistoryTable;