import { Pencil, Trash2 } from "lucide-react";
function StudentTable({
    students,
    loading,
    onEdit,
    onDelete,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow">
        <p className="text-slate-500">Loading students...</p>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow">
        <p className="text-slate-500">No students found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-6 py-4 text-left">
              User ID
            </th>

            <th className="px-6 py-4 text-left">
              Full Name
            </th>

            <th className="px-6 py-4 text-left">
              Email
            </th>

            <th className="px-6 py-4 text-left">
              Phone
            </th>

            <th className="px-6 py-4 text-left">
              Status
            </th>
            <th className="px-6 py-4 text-center">
                Action
            </th>
       
          </tr>

        </thead>

        <tbody>

          {students.map((student) => (

            <tr
              key={student._id}
              className="border-t hover:bg-slate-50 transition"
            >

              <td className="px-6 py-4">
                {student.userId}
              </td>

              <td className="px-6 py-4 font-medium">
                {student.fullName}
              </td>

              <td className="px-6 py-4">
                {student.email}
              </td>

              <td className="px-6 py-4">
                {student.phone}
              </td>

              <td className="px-6 py-4">

                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    student.isBlocked
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {student.isBlocked ? "Blocked" : "Active"}
                </span>

              </td>
              <td className="px-6 py-4">

            <div className="flex items-center justify-center gap-3">

                <button
                    onClick={() => onEdit(student)}
                    className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-100"
                    title="Edit Student"
                 >
                    <Pencil size={18} />
                </button>

                <button
                    onClick={() => onDelete(student)}
                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-100"
                    title="Delete Student"
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
}

export default StudentTable;