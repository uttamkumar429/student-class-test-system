import { Pencil, Trash2 } from "lucide-react";

const ExamTable = ({ exams, loading, onEdit, onDelete }) => {
  console.log("ExamTable Props:", exams);
  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow">
        Loading exams...
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow">
        No exams found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Subject</th>
            <th className="px-4 py-3 text-left">Class</th>
            <th className="px-4 py-3 text-left">Marks</th>
            <th className="px-4 py-3 text-left">Duration</th>
            <th className="px-4 py-3 text-left">Exam Date</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {exams.map((exam) => (
            <tr
              key={exam._id}
              className="border-t hover:bg-gray-50"
            >
              <td className="px-4 py-3">{exam.title}</td>

              <td className="px-4 py-3">{exam.subject}</td>

              <td className="px-4 py-3">{exam.className}</td>

              <td className="px-4 py-3">
                {exam.totalMarks}
              </td>

              <td className="px-4 py-3">
                {exam.duration} min
              </td>

              <td className="px-4 py-3">
                {new Date(exam.examDate).toLocaleDateString()}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium
                  ${
                    exam.status === "Upcoming"
                      ? "bg-blue-100 text-blue-700"
                      : exam.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {exam.status}
                </span>
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(exam)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(exam._id)}
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

export default ExamTable;