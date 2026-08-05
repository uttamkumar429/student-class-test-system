import TestRow from "./TestRow";

function TestTable({
  tests,
  onView,
  onEdit,
  onPublish,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-6 py-4 text-left">
                Title
              </th>

              <th className="px-6 py-4 text-left">
                Subject
              </th>

              <th className="px-6 py-4 text-center">
                Questions
              </th>

              <th className="px-6 py-4 text-center">
                Marks
              </th>

              <th className="px-6 py-4 text-center">
                Duration
              </th>

              <th className="px-6 py-4 text-center">
                Status
              </th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {tests.map((test) => (
              <TestRow
                key={test._id}
                test={test}
                onView={onView}
                onEdit={onEdit}
                onPublish={onPublish}
                onDelete={onDelete}
              />
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default TestTable;