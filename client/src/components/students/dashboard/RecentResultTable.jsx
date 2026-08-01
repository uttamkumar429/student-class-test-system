import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RecentResults() {
  const navigate = useNavigate();

  // Temporary Data
  // Later it will come from API
  const results = [
    {
      id: 1,
      subject: "Java Programming",
      date: "20 Jul 2026",
      marks: 88,
      totalMarks: 100,
      status: "Pass",
    },
    {
      id: 2,
      subject: "DBMS",
      date: "18 Jul 2026",
      marks: 92,
      totalMarks: 100,
      status: "Pass",
    },
    {
      id: 3,
      subject: "Computer Networks",
      date: "12 Jul 2026",
      marks: 39,
      totalMarks: 100,
      status: "Fail",
    },
  ];

  const handleViewResult = (resultId) => {
    navigate(`/student/result/${resultId}`);
  };

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Recent Results
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest examination performance.
          </p>
        </div>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Subject
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Date
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Marks
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {results.map((result) => (

              <tr
                key={result.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >

                <td className="px-6 py-4 font-medium text-slate-800">
                  {result.subject}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {result.date}
                </td>

                <td className="px-6 py-4">

                  <span className="font-semibold">
                    {result.marks}
                  </span>

                  <span className="text-slate-500">
                    /{result.totalMarks}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      result.status === "Pass"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {result.status}
                  </span>

                </td>

                <td className="px-6 py-4 text-center">

                  <button
                    onClick={() => handleViewResult(result.id)}
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

    </section>
  );
}

export default RecentResults;