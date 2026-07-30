function ResultSummary({
  examTitle,
  subject,
  obtainedMarks,
  totalMarks,
  percentage,
  status,
}) {
  return (
    <section className="rounded-xl bg-white p-8 shadow">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          Exam Result
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          {examTitle}
        </h1>

        <p className="mt-2 text-lg text-gray-600">
          {subject}
        </p>

        <div className="mt-8">
          <h2 className="text-6xl font-bold text-gray-900">
            {obtainedMarks}/{totalMarks}
          </h2>

          <p className="mt-3 text-2xl font-semibold text-gray-700">
            {Number(percentage ?? 0).toFixed(2)}%
          </p>

          <span
            className={`mt-5 inline-flex rounded-full px-5 py-2 text-sm font-semibold ${
              status === "Pass"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status === "Pass" ? "✅ PASS" : "❌ FAIL"}
          </span>
        </div>
      </div>
    </section>
  );
}

export default ResultSummary;