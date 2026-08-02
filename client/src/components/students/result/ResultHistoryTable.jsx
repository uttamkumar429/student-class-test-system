import ResultHistoryRow from "./ResultHistoryRow";

function ResultHistoryTable({ results }) {
  if (!results.length) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <h2 className="text-xl font-semibold text-slate-700">
                No Results Found
            </h2>

            <p className="mt-3 text-slate-500">
                Your completed examinations will appear here.
            </p>

        </section>
    );
}
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